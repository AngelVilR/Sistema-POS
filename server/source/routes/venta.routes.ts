import { Router } from "express";
import { VentaController } from "../controllers/VentaController.js";

export class VentaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new VentaController();

        /* Listado */
        router.get("/", controller.get);        

        /* Crear */
        router.post("/", controller.create);

        /* Obtener una venta */
        router.get(
            "/:eventoId/:usuarioId/:productoId",
            controller.getById
        );

        /* Actualizar */
        router.put(
            "/:eventoId/:usuarioId/:productoId",
            controller.update
        );

        /* Eliminar */
        router.delete(
            "/:eventoId/:usuarioId/:productoId",
            controller.delete
        );

        return router;
    }
}