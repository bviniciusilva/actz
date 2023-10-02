import mongoose, { Schema, model } from "mongoose"
import { Pagamento, formasPagamento, statusPagamento } from "src/domain/pagamento/entities/pagamento"
import { PedidoModel } from "../../pedido/models/pedido.mongo"


const PagamentoSchema = new Schema<Pagamento>(
  {
    _id: { type: Schema.Types.ObjectId },
    pedido: { type: mongoose.Types.ObjectId, ref: PedidoModel },
    status: { type: String, required: true, enum: statusPagamento },
    valor: { type: Number, required: true },
    valorPago: { type: Number, required: false, default: null },
    formaPagamento: { type: String, required: false, default: null, enum: formasPagamento },
    deletedAt: { type: Date, required: false, default: null },
  },
  { timestamps: true }
)

export const PagamentoModel = model<Pagamento>("Pagamento", PagamentoSchema)
