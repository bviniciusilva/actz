import * as Joi from "joi"
import { DTO } from "@shared/ports/dto"
import { formasPagamento, statusPagamento } from "src/domain/pagamento/entities/pagamento"
import { PagamentoDto } from "src/domain/pagamento/dtos/pagamento.dto"
import { PedidoProps } from "src/domain/pedido/entities/pedido"

const pedidoSchema = Joi.object({
  _id: Joi.any().required(),
}).required()

export class RealizarPagamentoDTO implements RealizarPagamentoDTO {
  static schema = Joi.object({
    pedido: pedidoSchema,
    valor: Joi.number().min(0).optional(),
    valorPago: Joi.number().min(0).required(),
    formaPagamento: Joi.string()
      .required()
      .valid(...formasPagamento)
  })

  static validate(req: any, res: any, next: any): boolean {
    const dto = new DTO(RealizarPagamentoDTO.schema)
    return dto.validate(req, res, next)
  }
}
