import { UseCase } from "src/shared/ports/usecase"
import { WebhookDto } from "../dtos/webhook.dto"
import { Webhook, WebhookProps } from "../entities/webhook"
import { Repository } from "src/shared/ports/repository"
import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"

type InputProps = {
  _id: string
  props: WebhookProps
}
type OutputProps = Webhook

export class EditarWebhookUseCase implements UseCase<InputProps, OutputProps> {
  constructor(private readonly repository: Repository<Webhook>) {}

  async execute({ _id, props }: InputProps): Promise<OutputProps> {
    const item = await this.repository.buscarUm({
      query: { _id },
    })
    Object.entries(props).forEach(([key, value]) => {
      item[key] = value
    })
    if (!item) throw new RegistroInexistenteException({campo: _id})
    return await this.repository.editar({ _id, item })
  }
}
