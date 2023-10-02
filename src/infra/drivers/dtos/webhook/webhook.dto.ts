import * as Joi from "joi"
import { DTO } from "@shared/ports/dto"
import { WebhookDto } from "src/domain/webhook/dtos/webhook.dto"

export class WebhookDTO implements WebhookDto {
  url: string

  static schema = Joi.object({
    url: Joi.string().required(),
  })

  static validate(req: any, res: any, next: any): boolean {
    const dto = new DTO(WebhookDTO.schema)
    return dto.validate(req, res, next)
  }
}
