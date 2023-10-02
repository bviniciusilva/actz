import { Repository } from "@shared/ports/repository";
import { UseCase } from "@shared/ports/usecase";
import { Item } from "@domain/item/entities/item";

interface DeletarItemDto {
  _id: string;
}

type OutputProps = boolean;

export class DeletarItemUseCase
  implements UseCase<DeletarItemDto, OutputProps>
{
  constructor(private readonly repository: Repository<Item>) {}

  async execute({ _id }: DeletarItemDto): Promise<OutputProps> {
    return await this.repository.deletar({ _id });
  }
}
