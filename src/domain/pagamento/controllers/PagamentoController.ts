import { BaseRepository, Repository } from "@shared/ports/repository"
import { RealizarPagamentoUseCase } from "../usecases/realizarPagamento.usecase";
import { Pagamento, PagamentoProps } from "../entities/pagamento";
import { Pedido } from "src/domain/pedido/entities/pedido";
import { RealizarPagamentoDto } from "../dtos/realizarPagamento.dto";
import GatewayPagamento from "../ports/gatewayPagamento";
import { WebhookGatewayAdapter } from "src/domain/webhook/adapters/gatewayWebhook.adapter";
import WebhookGateway from "src/domain/webhook/ports/webhookGateway";

export class PagamentoController {
  private readonly realizarPagamentoUseCase: RealizarPagamentoUseCase;

  constructor(
    private readonly repository: BaseRepository<Pagamento>,
    private readonly pedidoRepository: BaseRepository<Pedido>,
    private readonly gateway: GatewayPagamento,
    private readonly webhookGateway: WebhookGateway
  ) {
    this.realizarPagamentoUseCase = new RealizarPagamentoUseCase(this.repository, this.pedidoRepository, this.gateway, this.webhookGateway)
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

  async processar(body: RealizarPagamentoDto) {
    return this.realizarPagamentoUseCase.execute(body)
  }

  async consultar(_id: string) {
    return this.gateway.consultar(_id)
  }
}
