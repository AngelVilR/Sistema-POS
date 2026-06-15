import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new UsuarioController();

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