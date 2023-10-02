import * as express from "express";
const router = express.Router();
import clienteRoutes from "./cliente.route";
import itensRoutes from "./item.route";
import pedidosRoutes from "./pedido.route";
import pagamentosRoutes from "./pagamento.route";
import webhooksRoutes from "./webhook.route";

router.use('/clientes',clienteRoutes);
router.use('/itens',itensRoutes);
router.use('/pedidos',pedidosRoutes);
router.use('/pagamentos',pagamentosRoutes);
router.use('/webhooks',webhooksRoutes);

// 404
router.use(function (req, res) {
  res.status(404).json({
    status: "404 - Route not found",
  });
});

export default router;
