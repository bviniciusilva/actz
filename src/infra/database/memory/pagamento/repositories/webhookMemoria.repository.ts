import {
  BaseRepository,
  BuscarUmProps,
  CriarProps,
  DeletarProps,
  EditarProps,
  IsUniqueProps,
  Repository,
} from "@shared/ports/repository"
import { DtoValidationException } from "src/shared/exceptions/dtoValidationError.exception"
import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"
import { Webhook } from "src/domain/webhook/entities/webhook"
import { RegistroExistenteException } from "src/shared/exceptions/registroExistente.exception"

export class WebhookMemoriaRepository implements Repository<Webhook> {
  private static instance: WebhookMemoriaRepository
  private static webhooks: Webhook[] = []

  public static get Instance() {
    return this.instance || (this.instance = new this())
  }

  async listar(): Promise<Webhook[]> {
    return WebhookMemoriaRepository.webhooks.filter((i) => !i.deletedAt)
  }

  async criar({ item }: CriarProps<Webhook>): Promise<Webhook> {
    if (!item._id) item.generateId()
    item.validar()
    const isPedidoUnique =
      item.nome &&
      (await this.isUnique({
        prop: "pedidoId",
        value: item.pedidoId,
      }))
    if (isPedidoUnique === false)
      throw new RegistroExistenteException({
        mensagem: `Já existe um webhook com pedido ${item.pedidoId}`,
      })
    WebhookMemoriaRepository.webhooks.push(item)
    return item
  }

  async isUnique(props: IsUniqueProps): Promise<boolean> {
    for (let index = 0; index < WebhookMemoriaRepository.webhooks.length; index++) {
      const item = WebhookMemoriaRepository.webhooks[index]
      if (
        // @ts-ignore
        item[props.prop] !== undefined &&
        // @ts-ignore
        item[props.prop] == props.value &&
        item._id != props.ignoreId
      )
        return false
    }
    return true
  }

  async buscarUm(props: BuscarUmProps): Promise<Webhook | null> {
    return (
      WebhookMemoriaRepository.webhooks.find((_item) => {
        let hasValue = true
        Object.entries(props.query).forEach(([key, value]) => {
          // @ts-ignore
          if (_item[key] !== undefined && _item[key] != value) hasValue = false
        })
        return hasValue
      }) ?? null
    )
  }

  async deletar({ _id }: DeletarProps): Promise<boolean> {
    const item = await this.buscarUm({ query: { _id } })
    if (!item) throw new RegistroInexistenteException({ campo: "id" })
    item.deletedAt = new Date()
    return true
  }

  async editar({ _id, item }: EditarProps<Webhook>): Promise<Webhook> {
    const itemIndex = WebhookMemoriaRepository.webhooks.findIndex((_item) => _item._id == item._id)
    if (itemIndex < 0) throw new RegistroInexistenteException({})
    let cliente = WebhookMemoriaRepository.webhooks[itemIndex]
    Object.entries(item).forEach(([key, value]) => {
      cliente[key] = value
    })
    return WebhookMemoriaRepository.webhooks[itemIndex]
  }
}
