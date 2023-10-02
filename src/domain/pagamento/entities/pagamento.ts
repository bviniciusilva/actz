import { Pedido, PedidoProps } from "src/domain/pedido/entities/pedido";
import { DefaultClass } from "src/shared/types/defaultClass";
import { formatToCurrency } from "src/shared/utils";

export const statusPagamento = ["pendente","pago","cancelado"]
export type StatusPagamento = typeof statusPagamento[number];
export const formasPagamento = ["dinheiro","cartao","pix","mercadoPago"]
export type FormasPagamento = typeof formasPagamento[number];

export interface PagamentoProps {
    _id?: any;
    pedido: PedidoProps;
    valor: number;
    valorPago?: number;
    status: StatusPagamento;
    formaPagamento: FormasPagamento;
    dataPagamento?: Date;
}

export class Pagamento extends DefaultClass implements PagamentoProps {
    _id?: any;
    pedido: Pedido;
    valor: number;
    valorPago?: number;
    status: StatusPagamento;
    formaPagamento: FormasPagamento;
    dataPagamento?: Date;

    constructor(props: Partial<PagamentoProps>) {
        super()
        Object.assign(this, props)
        if(!props.status) {
            if(this.valorPago) this.status = "pago"
            else this.status = "pendente"
        }
        if(!props.valor) this.valor = props.pedido.valor
    }

    validar() {
        this.validarCampos();
        if(!this.status) this.status = "pendente"
        if(!formasPagamento.includes(this.formaPagamento)) throw new Error("Forma de pagamento inválida");
        if(this.valorPago > this.valor) throw new Error("Valor pago não pode ser maior que o valor do pagamento")
        if(this.valorPago < this.valor) throw new Error(`Valor pago não pode ser menor que o valor do pedido: R$${formatToCurrency(this.valor)}`);
        return;
    }
    
    private validarCampos() {
        if(!this.pedido) throw new Error("Pedido não informado")
        if(!this.valor) throw new Error("Valor não informado")
        if(!this.formaPagamento) throw new Error("Forma de pagamento não informada")
    }
}