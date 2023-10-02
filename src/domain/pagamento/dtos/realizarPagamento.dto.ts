import { PedidoProps } from "src/domain/pedido/entities/pedido";
import { FormasPagamento, PagamentoProps } from "../entities/pagamento";

export interface RealizarPagamentoDto extends Partial<PagamentoProps> {
    pedido: PedidoProps
    valorPago: number
    formaPagamento: FormasPagamento;
}
