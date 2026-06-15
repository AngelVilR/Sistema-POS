import { Router } from "express";
import { FacturaController } from "../controllers/FacturaController.js";

export class FacturaRoutes {
    static get routes(): Router {

        const router = Router();
        const controller = new FacturaController();

        router.get("/", controller.get);
        router.post("/", controller.create);
        router.get("/:id", controller.getById);
        router.put("/:id", controller.update);
        router.delete("/:id", controller.delete);

        return router;
    }
}