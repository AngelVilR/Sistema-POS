import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/config/prisma.js";

export class ReporteController {
    getVentasPorTipoTransaccion = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const facturas = await prisma.facturaEnc.findMany({
                orderBy: { fecha: "asc" },
                select: {
                    fecha: true,
                    metodo_pago: true,
                    total: true,
                }
            });

            const grouped: Record<string, Record<string, number>> = {};

            for (const factura of facturas) {
                const dateStr = factura.fecha.toISOString().split('T')[0];
                const metodo = factura.metodo_pago;
                const total = Number(factura.total);

                if (!grouped[dateStr]) {
                    grouped[dateStr] = {};
                }

                if (!grouped[dateStr][metodo]) {
                    grouped[dateStr][metodo] = 0;
                }

                grouped[dateStr][metodo] += total;
            }

            const result = Object.entries(grouped).map(([fecha, metodos]) => ({
                fecha,
                ...metodos
            }));

            response.json(result);
        } catch (error) {
            next(error);
        }
    };

    getProductosPorVentas = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const detalle = await prisma.facturaDet.findMany({
                select: {
                    cantidad: true,
                    producto: {
                        select: { nombre: true }
                    }
                }
            });

            const grouped: Record<string, number> = {};

            for (const det of detalle) {
                const nombre = det.producto.nombre;
                grouped[nombre] = (grouped[nombre] ?? 0) + det.cantidad;
            }

            const result = Object.entries(grouped)
                .map(([producto, cantidad]) => ({ producto, cantidad }))
                .sort((a, b) => b.cantidad - a.cantidad);

            response.json(result);
        } catch (error) {
            next(error);
        }
    };

    getVentasPorUsuario = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const facturas = await prisma.facturaEnc.findMany({
                select: {
                    total: true,
                    usuario: {
                        select: { nombre: true }
                    }
                }
            });

            const grouped: Record<string, { total: number; cantidadFacturas: number }> = {};

            for (const factura of facturas) {
                const nombre = factura.usuario.nombre;
                if (!grouped[nombre]) {
                    grouped[nombre] = { total: 0, cantidadFacturas: 0 };
                }
                grouped[nombre].total += Number(factura.total);
                grouped[nombre].cantidadFacturas += 1;
            }

            const result = Object.entries(grouped)
                .map(([usuario, data]) => ({
                    usuario,
                    total: data.total,
                    cantidadFacturas: data.cantidadFacturas,
                }))
                .sort((a, b) => b.total - a.total);

            response.json(result);
        } catch (error) {
            next(error);
        }
    };
}
