import { Router } from 'express';
import { ProductoRoutes } from './producto.routes.js';
import { UsuarioRoutes } from './Usuario.routes.js';
import { EventoRoutes } from './evento.routes.js';
import { VentaRoutes } from './venta.routes.js';
import { FacturaRoutes } from './factura.routes.js';
export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // ----Agregar las rutas----
        /* Ruta Producto */
        router.use('/producto', ProductoRoutes.routes);
        router.use('/producto', ProductoRoutes.routes);

router.use('/usuario', UsuarioRoutes.routes);

router.use('/evento', EventoRoutes.routes);

router.use('/venta', VentaRoutes.routes);

router.use('/factura', FacturaRoutes.routes);
        return router;
    }
}
