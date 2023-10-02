import * as express from "express"
import { response } from "@infra/drivers/utils"
import { ApiController } from "@infra/drivers/api/ApiController"
import { WebhookDTO } from "../dtos/webhook/webhook.dto"
const router = express.Router()

const apiController = ApiController.Instance

router.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return response(apiController.webhookController.listar(req.query), res, next)
})

router.post("/", WebhookDTO.validate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const body = req.body
  return response(apiController.webhookController.criar(body), res, next)
})

router.delete("/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return response(apiController.webhookController.deletar(req.params.id), res, next)
})


export default router
