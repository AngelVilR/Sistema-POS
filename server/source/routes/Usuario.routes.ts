import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new UsuarioController();

        /* Listado */
        router.get("/", controller.get);    
            

        /* Crear */
        router.post("/", controller.create);
        router.post("/login", controller.login);

        /* Obtener por ID */
        router.get("/profile", authenticateJWT, controller.userAuth);
        router.get("/:id", controller.getById);

        /* Actualizar */
        router.put("/updatePassword/:id", controller.updatePassword);
        router.put("/:id", controller.update);
        

        /* Eliminar */
        router.delete("/:id", controller.delete);

        /* Verificar si el correo electrónico existe */
        router.get("/check-email/:email", controller.checkEmail);

        return router;
    }
}