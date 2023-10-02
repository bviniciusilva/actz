import { Repository } from "@shared/ports/repository"
import { Item, ItemProps } from "@domain/item/entities/item"
import { EditarItemUseCase } from "../usecases/editarItem.usecase";
import { CadastrarItemUseCase } from "../usecases/cadastrarItem.usecase";

export class ItemController {
  private readonly cadastrarItemUseCase: CadastrarItemUseCase;
  private readonly editarItemUseCase: EditarItemUseCase;
  constructor(private readonly repository: Repository<Item>) {
    this.cadastrarItemUseCase = new CadastrarItemUseCase(this.repository)
    this.editarItemUseCase = new EditarItemUseCase(this.repository)
  }

  async listar(queryProps?: Object) {
    return this.repository.listar(queryProps)
  }

  async buscarUm(_id: string) {
    return this.repository.buscarUm({
      query: {
        _id,
      },
    })
  }

  async criar(body: ItemProps) {
    return this.cadastrarItemUseCase.execute(body)
  }

  async editar(_id: string, body: ItemProps) {
    return this.editarItemUseCase.execute({_id, props: body})
  }

  async deletar(_id: string) {
    return this.repository.deletar({ _id })
  }
}
