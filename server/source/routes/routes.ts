import { Router } from 'express';
import { ProductoRoutes } from './producto.routes.js';
export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // ----Agregar las rutas----
        /* Ruta Producto */
        router.use('/producto', ProductoRoutes.routes);
        return router;
    }
}
