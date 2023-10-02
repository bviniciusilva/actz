import { BaseRepository, Repository } from "src/shared/ports/repository"
import { Pagamento, PagamentoProps } from "../entities/pagamento"
import { Pedido } from "src/domain/pedido/entities/pedido"

export interface GatewayProps {
  apiKey: string
  apiSecret: string
  apiURL: string
}

export interface OutputProps {
  status: string
  code: number
}

export default abstract class GatewayPagamento {
  protected statuses = [
    {
      status: "pago",
      code: 200,
    },
    {
      status: "pendente",
      code: 200,
    },
    {
      status: "cancelado",
      code: 200,
    },
    {
      status: "erro",
      code: 500,
    },
  ]
  constructor(
    protected readonly pedidoRepo: Repository<Pedido>,
    protected readonly pagamentoRepo: Repository<Pagamento>
  ) {}
  props: GatewayProps
  abstract processar(props: PagamentoProps): Promise<OutputProps>;
  abstract consultar(_id: string): Promise<OutputProps>;
}
