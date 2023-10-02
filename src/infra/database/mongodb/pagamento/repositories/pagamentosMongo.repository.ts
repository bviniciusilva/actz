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
import { Pagamento } from "src/domain/pagamento/entities/pagamento"
import { PagamentoModel } from "../models/pagamento.mongo"

export class PagamentosMongoRepository implements Repository<Pagamento> {
  constructor(private readonly pedidoRepository: Repository<Pedido>) {}

  async editar({ _id, item }: EditarProps<Pagamento>): Promise<Pagamento> {
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

    await PagamentoModel.updateOne({ _id }, item)
    return this.buscarUm(query)
  }

  async isUnique?(props: IsUniqueProps | IsUniqueManyProps): Promise<boolean> {
    return true
  }

  async deletar({ _id }: DeletarProps): Promise<boolean> {
    const item = await this.buscarUm({ query: { _id } })
    if (!item) throw new RegistroInexistenteException({ campo: "id" })
    item.deletedAt = new Date()
    await PagamentoModel.updateOne({ _id }, item)
    return true
  }

  private async validarForeignKeys(item: Pagamento) {
    const pedido = await this.pedidoRepository.buscarUm({ query: { _id: item.pedido._id } })
    if (!pedido)
      throw new RegistroInexistenteException({ mensagem: `Pedido com id ${item.cliente?._id} não encontrado` })
    item.pedido = pedido
    return
  }

  async listar(queryProps?: any): Promise<Pagamento[]> {
    if (queryProps.deletedAt) delete queryProps.deletedAt
    return PagamentoModel.find({ deletedAt: null, ...queryProps }).populate("pedido")
  }

  async criar({ item }: CriarProps<Pagamento>): Promise<Pagamento> {
    await this.validarForeignKeys(item)
    if (!item._id) {
      item._id = new mongoose.Types.ObjectId()
    }

    const _pedido = await PagamentoModel.create(item)
    return this.buscarUm({ query: { _id: _pedido._id } })
  }

  async buscarUm(props: BuscarUmProps): Promise<Pagamento | null> {
    if (!props.query) props.query = {}
    if (!props.query?.deletedAt) {
      props.query.deletedAt = null
    }
    return PagamentoModel.findOne(props.query).populate("pedido")
  }
}
