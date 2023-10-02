import mongoose from "mongoose"
import {
  BaseRepository,
  BuscarUmProps,
  CriarProps,
  DeletarProps,
  EditarProps,
  IsUniqueManyProps,
  IsUniqueProps,
  Repository,
} from "@shared/ports/repository"
import { Pedido } from "@domain/pedido/entities/pedido"
import { RegistroInexistenteException } from "@shared/exceptions/registroInexistente.exception"
import { Webhook } from "src/domain/webhook/entities/webhook"
import { WebhookModel } from "../models/webhook.mongo"
import { RegistroExistenteException } from "src/shared/exceptions/registroExistente.exception"

export class WebhooksMongoRepository implements Repository<Webhook> {
  constructor(private readonly pedidoRepository: Repository<Pedido>) {}

  async editar({ _id, item }: EditarProps<Webhook>): Promise<Webhook> {
    const query = {
      query: {
        _id,
      },
    }
    const _pedido = await this.buscarUm(query)
    if (!_pedido) throw new RegistroInexistenteException({ campo: "id" })
    await this.validarForeignKeys(item)
    if (!item.valor || isNaN(item.valor)) {
      item.valor = item.calcularValor()
    }

    await WebhookModel.updateOne({ _id }, item)
    return this.buscarUm(query)
  }

  async isUnique(props: IsUniqueProps): Promise<boolean> {
    let query: BuscarUmProps = {
      query: {
        [props.prop]: props.value,
      },
    }
    const item = await this.buscarUm(query)
    return item === null
  }

  async deletar({ _id }: DeletarProps): Promise<boolean> {
    const item = await this.buscarUm({ query: { _id } })
    if (!item) throw new RegistroInexistenteException({ campo: "id" })
    item.deletedAt = new Date()
    await WebhookModel.updateOne({ _id }, item)
    return true
  }

  private async validarForeignKeys(item: Webhook) {
    const pedido = await this.pedidoRepository.buscarUm({ query: { _id: item.pedido._id } })
    if (!pedido)
      throw new RegistroInexistenteException({ mensagem: `Pedido com id ${item.cliente?._id} não encontrado` })
    item.pedido = pedido
    return
  }

  async listar(queryProps?: any): Promise<Webhook[]> {
    if (queryProps?.deletedAt) delete queryProps.deletedAt
    return WebhookModel.find({ deletedAt: null, ...queryProps })
  }

  async criar({ item }: CriarProps<Webhook>): Promise<Webhook> {
    if (!item._id) {
      item._id = new mongoose.Types.ObjectId()
    }
    const isUnique =
      item.url &&
      (await this.isUnique({
        prop: "url",
        value: item.url,
      }))
    if (isUnique === false)
      throw new RegistroExistenteException({
        mensagem: `Já existe um webhook com url ${item.url}`,
      })

    const _webhook = await WebhookModel.create(item)
    return this.buscarUm({ query: { _id: _webhook._id } })
  }

  async buscarUm(props: BuscarUmProps): Promise<Webhook | null> {
    if (!props.query) props.query = {}
    if (!props.query?.deletedAt) {
      props.query.deletedAt = null
    }
    return WebhookModel.findOne(props.query)
  }
}
