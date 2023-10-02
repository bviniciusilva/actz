import { Repository } from "src/shared/ports/repository"
import { Webhook, WebhookMethod } from "../entities/webhook"

export default abstract class WebhookGateway {
  protected queue: Webhook[] = []
  constructor(protected repository: Repository<Webhook>) {
  }
  abstract processar(): Promise<void>

  async initQueue(): Promise<void> {
    this.queue = await this.repository.listar()
    console.log(`Webhookgateway: ${this.queue.length} webhooks carregados.`)
  }

  enqueue(body: Webhook) {
    this.queue.push(body)
    console.log(`Webhookgateway: ${this.queue.length} webhooks na fila.`)
  }

  dequeue(_id: string): Webhook {
    let index = this.queue.findIndex((hook) => hook._id === _id)
    if (index == -1) return null
    let res = this.queue.splice(index, 1)[0]
    console.log(`Webhookgateway: ${this.queue.length} webhooks na fila.`)
    return res
  }

  fire(method: WebhookMethod, props: any) {
    this.queue.forEach((webhook) => {
      console.log(`Webhookgateway: ${webhook.url} para o método ${method} chamado.`)
    })
  }
}
