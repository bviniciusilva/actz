import * as express from "express"
import { response } from "@infra/drivers/utils"
import { ApiController } from "@infra/drivers/api/ApiController"
import { RealizarPagamentoDTO } from "../dtos/pagamento/realizarPagamento.dto"
const router = express.Router()

const apiController = ApiController.Instance

router.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return response(apiController.pagamentoController.listar(req.query), res, next)
})

router.get("/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return response(apiController.pagamentoController.buscarUm(req.params.id), res, next)
})

router.get("/:id/consultar", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return response(apiController.pagamentoController.consultar(req.params.id), res, next)
})

router.post("/", RealizarPagamentoDTO.validate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const body = req.body
  return response(apiController.pagamentoController.processar(body), res, next)
})


export default router
