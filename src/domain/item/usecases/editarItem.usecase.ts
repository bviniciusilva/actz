import { Repository } from "@shared/ports/repository"
import { UseCase } from "@shared/ports/usecase"
import { Item, ItemProps } from "@domain/item/entities/item"
import { RegistroInexistenteException } from "@shared/exceptions/registroInexistente.exception"
import { EditarItemDto } from "../dtos/editarItem.dto"

type InputProps = {
  _id: string
  props: EditarItemDto
}
type OutputProps = Item

export class EditarItemUseCase implements UseCase<InputProps, OutputProps> {
  constructor(private readonly repository: Repository<Item>) {}

  async execute({ _id, props }: InputProps): Promise<OutputProps> {
    const item = await this.repository.buscarUm({
      query: { _id },
    })
    Object.entries(props).forEach(([key, value]) => {
      item[key] = value
    })
    if (!item) throw new RegistroInexistenteException({})
    return await this.repository.editar({ _id, item })
  }
}
