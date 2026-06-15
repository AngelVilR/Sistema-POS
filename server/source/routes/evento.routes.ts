import { Router } from "express";
import { EventoController } from "../controllers/EventoController.js";

export class EventoRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new EventoController();

        /* Listado */
        router.get("/", controller.get);

        /* Obtener por ID */
        router.get("/:id", controller.getById);

        /* Crear */
        router.post("/", controller.create);

        /* Actualizar */
        router.put("/:id", controller.update);

        /* Eliminar */
        router.delete("/:id", controller.delete);

        return router;
    }
}