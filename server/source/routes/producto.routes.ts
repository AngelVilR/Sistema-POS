import { Router } from "express";
import { ProductoController } from "../controllers/productoController.js";

export class ProductoRoutes{
    static get routes(): Router{
        const router = Router();
        const controller = new ProductoController();

        /* Listado */
        router.get('/', controller.get);
        return router;
    }
}