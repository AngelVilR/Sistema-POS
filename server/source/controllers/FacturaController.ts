import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/config/prisma.js";

export class FacturaController {

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const listado = await prisma.facturaEnc.findMany({
                orderBy: {
                    id: "asc"
                },
                include: {
                    usuario: true,
                    evento: true,
                    facturasDet: {
                        include: {
                            producto: true
                        }
                    }
                }
            });

            response.json(listado);
        } catch (error) {
            next(error);
        }
    };

    getById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            const factura = await prisma.facturaEnc.findUnique({
                where: {
                    id
                },
                include: {
                    usuario: true,
                    evento: true,
                    facturasDet: {
                        include: {
                            producto: true
                        }
                    }
                }
            });

            if (!factura) {
                return response.status(404).json({
                    message: "Factura no encontrada"
                });
            }

            response.json(factura);

        } catch (error) {
            next(error);
        }
    };

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {
                usuarioId,
                eventoId,
                metodo_pago,
                descuento,
                subtotal,
                impuesto,
                total,
                facturasDet
            } = request.body;

            const factura = await prisma.facturaEnc.create({
                data: {
                    hora: new Date(),
                    metodo_pago,
                    descuento,
                    subtotal,
                    impuesto,
                    total,
                    usuarioId,
                    eventoId,                    
                },
                include: {
                    usuario: true,
                    evento: true,
                    facturasDet: {
                        include: {
                            producto: true
                        }
                    }
                }
            });

            await prisma.facturaDet.createMany({
                data: facturasDet.map((item: any) => ({
                    pedidoId: factura.id,
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    total: item.total,
                }))
            });

            response.status(201).json(factura);
        } catch (error) {
            next(error);
        }
    };

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {

            const id = Number(request.params.id);
            const factura = await prisma.facturaEnc.update({
                where: {
                    id
                },
                data: {
                    metodo_pago: request.body.metodo_pago,
                    descuento: request.body.descuento,
                    subtotal: request.body.subtotal,
                    impuesto: request.body.impuesto,
                    total: request.body.total
                }
            });

            response.json(factura);

        } catch (error) {
            next(error);
        }
    };

    delete = async (request: Request, response: Response, next: NextFunction) => {
        try {

            const id = Number(request.params.id);

            await prisma.facturaDet.deleteMany({
                where: {
                    pedidoId: id
                }
            });

            await prisma.facturaEnc.delete({
                where: {
                    id
                }
            });

            response.json({
                message: "Factura eliminada correctamente"
            });

        } catch (error) {
            next(error);
        }
    };
}