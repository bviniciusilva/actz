import { BaseRepository, BuscarUmProps, CriarProps, DeletarProps, EditarProps, Repository } from "@shared/ports/repository"
import { DtoValidationException } from "src/shared/exceptions/dtoValidationError.exception"
import { Pagamento } from "src/domain/pagamento/entities/pagamento"
import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"

export class PagamentoMemoriaRepository implements Repository<Pagamento> {
  private static instance: PagamentoMemoriaRepository
  private static pagamentos: Pagamento[] = []

  public static get Instance() {
    return this.instance || (this.instance = new this())
  }

  async listar(): Promise<Pagamento[]> {
    return PagamentoMemoriaRepository.pagamentos.filter((i) => !i.deletedAt)
  }

  async criar({ item }: CriarProps<Pagamento>): Promise<Pagamento> {
    if (!item._id) item.generateId()
    item.validar()
    PagamentoMemoriaRepository.pagamentos.push(item)
    return item
  }

  async buscarUm(props: BuscarUmProps): Promise<Pagamento | null> {
    return (
      PagamentoMemoriaRepository.pagamentos.find((_item) => {
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

  async editar({ _id, item }: EditarProps<Pagamento>): Promise<Pagamento> {
    const itemIndex = PagamentoMemoriaRepository.pagamentos.findIndex((_item) => _item._id == item._id)
    if (itemIndex < 0) throw new RegistroInexistenteException({})
    let cliente = PagamentoMemoriaRepository.pagamentos[itemIndex]
    Object.entries(item).forEach(([key, value]) => {
      cliente[key] = value
    })
    return PagamentoMemoriaRepository.pagamentos[itemIndex]
  }
}
