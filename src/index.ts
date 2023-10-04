import { Cliente, ClienteProps } from "@domain/cliente/entities/cliente"
import { ClienteMemoriaRepository } from "@infra/database/memory/cliente/repositories/clientesMemoria.repository"
import { ClienteSeeder } from "@infra/database/memory/cliente/seeders/cliente.seeder"
import { Item, ItemProps } from "@domain/item/entities/item"
import { ItemMemoriaRepository } from "@infra/database/memory/item/repositories/itemMemoria.repository"
import { ItemSeeder } from "@infra/database/memory/item/seeders/item.seeder"
import { JsonDataReader } from "@shared/adapters/jsonDataReader"
import { MongoConnection } from "@infra/database/mongodb/adapters/MongoConnection"
import { ClienteMongoRepository } from "@infra/database/mongodb/cliente/repositories/clientesMongo.repository"
import { Repository } from "./shared/ports/repository"
import { ItemMongoRepository } from "./infra/database/mongodb/item/repositories/itensMongo.repository"
import config from "@shared/config"

const isMemoryDatabase = config.NODE_ENV == "production" || config.NODE_ENV == "debug"
console.log({isMemoryDatabase})
let clientesRepository: Repository<Cliente>
let itensRepository: Repository<Item>

// DATAREADERS ===================================================================
async function bootstrapMemoryDatabase() {
  const clientesDataReader = new JsonDataReader<ClienteProps[]>()
  const itensDataReader = new JsonDataReader<ItemProps[]>()
  clientesRepository = ClienteMemoriaRepository.Instance
  itensRepository = ItemMemoriaRepository.Instance
  const clientesSeeder = new ClienteSeeder(clientesRepository, clientesDataReader)
  const itensSeeder = new ItemSeeder(itensRepository, itensDataReader)
  console.time("seeding")
  console.log("SEEDING STARTED....")
  await clientesSeeder.seed()
  await itensSeeder.seed()
  console.log(`SEEDING FINISHED...`)
  console.timeEnd("seeding")
}

async function bootstrapMongoDatabase() {
  console.log(config)
  const client = new MongoConnection({
    user: config.mongo.MONGO_USER,
    password: config.mongo.MONGO_PW,
    database: config.mongo.MONGO_DATABASE,
    host: config.mongo.MONGO_HOST,
    port: +config.mongo.MONGO_PORT,
  })
  await client.connect()
  clientesRepository = new ClienteMongoRepository()
  itensRepository = new ItemMongoRepository()
}

// SEEDERS =======================================================================

async function bootstrap() {
  try {
    if (isMemoryDatabase) bootstrapMemoryDatabase()
    else bootstrapMongoDatabase()
  } catch (error) {
    console.log(error)
  }
}

bootstrap()
