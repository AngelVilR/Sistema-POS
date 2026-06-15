import { Router } from "express";
import { ProductoController } from "../controllers/productoController.js";

export class ProductoRoutes{
    static get routes(): Router{
        const router = Router();
        const controller = new ProductoController();

        /* Listado */
        router.get('/', controller.get);        

        // Crear
        router.post("/", controller.create);

        // Obtener por id
        router.get("/:id", controller.getById);

        // Actualizar
        router.put("/:id", controller.update);

        // Eliminar
        router.delete("/:id", controller.delete);

        return router;
    }
}