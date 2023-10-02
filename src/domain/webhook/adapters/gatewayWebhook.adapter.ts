import { Repository } from "src/shared/ports/repository"
import { Webhook, WebhookMethod } from "../entities/webhook"
import WebhookGateway from "../ports/webhookGateway"
import { GatewayWebhookMock } from "./gatewayWebhookMock.adapter"

export enum WebhookGatewayType {
  GatewayWebhookMock,
}

export class WebhookGatewayAdapter extends WebhookGateway {
  private gateway: WebhookGateway
  repository: Repository<Webhook>
  protected queue: Webhook[]

  constructor(type: WebhookGatewayType, repository: Repository<Webhook>) {
    super(repository)
    switch (type) {
      case WebhookGatewayType.GatewayWebhookMock:
        this.gateway = new GatewayWebhookMock(repository)
        break
      default:
        throw new Error("Tipo de gateway inválido.")
    }
  }

  fire(method: WebhookMethod, props: any): void {
    return this.gateway.fire(method, props)
  }

  enqueue(body: any): any {
    return this.gateway.enqueue(body)
  }

  dequeue(_id: string): any {
    return this.gateway.dequeue(_id)
  }

  async initQueue() {
    return this.gateway.initQueue()
  }

  async processar(): Promise<any> {
    return this.gateway.processar()
  }
}
