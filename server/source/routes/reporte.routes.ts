import { Router } from "express";
import { ReporteController } from "../controllers/ReporteController.js";

export class ReporteRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ReporteController();

        router.get("/ventas-por-tipo-transaccion", controller.getVentasPorTipoTransaccion);
        router.get("/productos-por-ventas", controller.getProductosPorVentas);
        router.get("/ventas-por-usuario", controller.getVentasPorUsuario);

        return router;
    }
}
