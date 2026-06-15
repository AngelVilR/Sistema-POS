import { Router } from "express";
import { EventoController } from "../controllers/EventoController.js";

export class EventoRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new EventoController();

        /* Listado */
        router.get("/", controller.get);        

        /* Crear */
        router.post("/", controller.create);

        /* Obtener por ID */
        router.get("/:id", controller.getById);
        
        /* Actualizar */
        router.put("/:id", controller.update);

        /* Eliminar */
        router.delete("/:id", controller.delete);

        return router;
    }
}