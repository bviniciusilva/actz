import mongoose, { Schema, model } from "mongoose"
import { PedidoModel } from "../../pedido/models/pedido.mongo"
import { Webhook } from "src/domain/webhook/entities/webhook"

const WebhookSchema = new Schema<Webhook>(
  {
    _id: { type: Schema.Types.ObjectId },
    pedido: { type: mongoose.Types.ObjectId, ref: PedidoModel },
    url: { type: String, required: true },
    deletedAt: { type: Date, required: false, default: null },
  },
  { timestamps: true }
)

export const WebhookModel = model<Webhook>("Webhook", WebhookSchema)
