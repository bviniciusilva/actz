import { Repository } from "src/shared/ports/repository"
import { Webhook, WebhookProps } from "../entities/webhook"
import { CadastrarWebhookUseCase } from "../usecases/cadastrarWebhook.usecase"
import { WebhookGatewayAdapter } from "../adapters/gatewayWebhook.adapter"
import { EditarWebhookUseCase } from "../usecases/editarWebhook.usecase"

export class WebhookController {
  private readonly cadastrarWebhookUseCase: CadastrarWebhookUseCase
  private readonly editarWebhookUseCase: EditarWebhookUseCase

  constructor(private readonly repository: Repository<Webhook>, private webhookGateway: WebhookGatewayAdapter) {
    this.cadastrarWebhookUseCase = new CadastrarWebhookUseCase(this.repository)
  }

  async criar(body: Webhook) {
    const res = await this.cadastrarWebhookUseCase.execute(body)
    this.webhookGateway.enqueue(res);
    return res
  }

  async listar(queryProps?: Object) {
    return this.repository.listar(queryProps)
  }

  async editar(_id: string, body: WebhookProps) {
    return this.editarWebhookUseCase.execute({_id, props: body})
  }

  async deletar(_id: string) {
    const res = await this.repository.deletar({ _id })
    this.webhookGateway.dequeue(_id);
    return res
  }
}
