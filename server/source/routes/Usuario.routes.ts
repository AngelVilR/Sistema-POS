import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new UsuarioController();

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

        /* Verificar si el correo electrónico existe */
        router.get("/check-email/:email", controller.checkEmail);

        return router;
    }
}