import { PagamentoProps, Pagamento } from "../entities/pagamento"
import GatewayPagamento, { OutputProps } from "../ports/gatewayPagamento"

export class GatewayPagamentoMock extends GatewayPagamento {
  async processar(props: PagamentoProps): Promise<OutputProps> {
    const pedido = await this.pedidoRepo.buscarUm({ query: { _id: props.pedido } })
    const pagamento = await this.pagamentoRepo.buscarUm({ query: { _id: props._id } })
    const res = await this.sendRequest()
    if (res.code == 200) {
      pagamento.status = res.status
      pagamento.dataPagamento = new Date()
      await this.pagamentoRepo.editar({ _id: pagamento._id, item: pagamento })
      pedido.status = "pago"
      await this.pedidoRepo.editar({ _id: pedido._id, item: pedido })
      return res
    } else {
      const err = new Error("Erro ao processar pagamento")
      err.name = "PagamentoError"
      throw err
    }
  }

  async consultar(_id: string): Promise<OutputProps> {
    return this.sendRequest();
  }

  private async sendRequest() {
    // retorna um status aleatório da variável statuses
    return this.statuses[Math.floor(Math.random() * this.statuses.length)]
  }
}
