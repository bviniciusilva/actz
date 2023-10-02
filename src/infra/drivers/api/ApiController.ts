import config from "@shared/config";
import { ClienteController } from "@domain/cliente/controllers/ClienteController"
import { ItemController } from "@domain/item/controllers/ItemController"
import { ClienteMongoRepository } from "@infra/database/mongodb/cliente/repositories/clientesMongo.repository"
import { ItemMongoRepository } from "@infra/database/mongodb/item/repositories/itensMongo.repository"
import { PedidoController } from "@domain/pedido/controllers/PedidoController"
import { PedidoMongoRepository } from "@infra/database/mongodb/pedido/repositories/pedidosMongo.repository"
import { ClienteMemoriaRepository } from "src/infra/database/memory/cliente/repositories/clientesMemoria.repository"
import { ItemMemoriaRepository } from "src/infra/database/memory/item/repositories/itemMemoria.repository"
import { PedidoMemoriaRepository } from "src/infra/database/memory/pedido/repositories/pedidosMemoria.repository"
import { PagamentoMemoriaRepository } from "src/infra/database/memory/pagamento/repositories/pagamentosMemoria.repository"
import { PagamentosMongoRepository } from "src/infra/database/mongodb/pagamento/repositories/pagamentosMongo.repository"
import { PagamentoController } from "src/domain/pagamento/controllers/PagamentoController"
import GatewayPagamento from "src/domain/pagamento/ports/gatewayPagamento"
import { GatewayPagamentoMock } from "src/domain/pagamento/adapters/gatewayPagamentoMock.adapter"
import { WebhookController } from "src/domain/webhook/controllers/WebhookController"
import { WebhooksMongoRepository } from "src/infra/database/mongodb/pagamento/repositories/webhookMongoRepository.repository"
import { WebhookMemoriaRepository } from "src/infra/database/memory/pagamento/repositories/webhookMemoria.repository"
import { WebhookGatewayAdapter, WebhookGatewayType } from "src/domain/webhook/adapters/gatewayWebhook.adapter"

export class ApiController {
  private static instance: ApiController
  clienteController: ClienteController
  itemController: ItemController
  pedidoController: PedidoController
  pagamentoController: PagamentoController
  gateway: GatewayPagamento
  webhookController: WebhookController
  webhookGateway: WebhookGatewayAdapter

  constructor() {
    const debug = config.NODE_ENV == 'production' || config.NODE_ENV == 'debug';
    let clienteRepo = debug ? new ClienteMemoriaRepository() : new ClienteMongoRepository();
    let itemRepo = debug ? new ItemMemoriaRepository() : new ItemMongoRepository();
    let pedidoRepo = debug ? new PedidoMemoriaRepository() : new PedidoMongoRepository(clienteRepo, itemRepo);
    let pagamentosRepo = debug ? new PagamentoMemoriaRepository() : new PagamentosMongoRepository(pedidoRepo);
    let webhookRepo = debug ? new WebhookMemoriaRepository() : new WebhooksMongoRepository(pedidoRepo);
    let webhookGateway = WebhookGatewayType.GatewayWebhookMock;
    
    this.webhookGateway = new WebhookGatewayAdapter(webhookGateway, webhookRepo);
    this.clienteController = new ClienteController(clienteRepo)
    this.itemController = new ItemController(itemRepo)
    this.pedidoController = new PedidoController(pedidoRepo)
    this.gateway = new GatewayPagamentoMock(pedidoRepo, pagamentosRepo);
    this.pagamentoController = new PagamentoController(pagamentosRepo, pedidoRepo, this.gateway, this.webhookGateway)
    this.webhookController = new WebhookController(webhookRepo, this.webhookGateway)
  }

  public static get Instance() {
    return this.instance || (this.instance = new this())
  }
}
