import { Repository } from "src/shared/ports/repository"
import WebhookGateway from "../ports/webhookGateway"
import { Webhook } from "../entities/webhook"

export class GatewayWebhookMock extends WebhookGateway {

  constructor(repository: Repository<Webhook>) {
    super(repository)
  }

  async processar(): Promise<any> {
    let promises = this.queue.map((hook, index) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    })

    return await Promise.all(promises)
  }
}
