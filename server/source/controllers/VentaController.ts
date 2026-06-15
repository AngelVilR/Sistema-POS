import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/config/prisma.js";

export class VentaController {

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const listado = await prisma.venta.findMany({
                include: {
                    usuario: true,
                    producto: true,
                    evento: true
                }
            });

            response.json(listado);
        } catch (error) {
            next(error);
        }
    };

    getById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const eventoId = Number(request.params.eventoId);
            const usuarioId = Number(request.params.usuarioId);
            const productoId = Number(request.params.productoId);

            const venta = await prisma.venta.findUnique({
                where: {
                    eventoId_usuarioId_productoId: {
                        eventoId,
                        usuarioId,
                        productoId
                    }
                },
                include: {
                    usuario: true,
                    producto: true,
                    evento: true
                }
            });

            if (!venta) {
                return response.status(404).json({
                    message: "Venta no encontrada"
                });
            }

            response.json(venta);
        } catch (error) {
            next(error);
        }
    };

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {
                eventoId,
                usuarioId,
                productoId,
                cantidad
            } = request.body;

            const venta = await prisma.venta.create({
                data: {
                    eventoId,
                    usuarioId,
                    productoId,
                    cantidad
                }
            });

            response.status(201).json(venta);
        } catch (error) {
            next(error);
        }
    };

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const eventoId = Number(request.params.eventoId);
            const usuarioId = Number(request.params.usuarioId);
            const productoId = Number(request.params.productoId);

            const venta = await prisma.venta.update({
                where: {
                    eventoId_usuarioId_productoId: {
                        eventoId,
                        usuarioId,
                        productoId
                    }
                },
                data: {
                    cantidad: request.body.cantidad
                }
            });

            response.json(venta);
        } catch (error) {
            next(error);
        }
    };

    delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const eventoId = Number(request.params.eventoId);
            const usuarioId = Number(request.params.usuarioId);
            const productoId = Number(request.params.productoId);

            await prisma.venta.delete({
                where: {
                    eventoId_usuarioId_productoId: {
                        eventoId,
                        usuarioId,
                        productoId
                    }
                }
            });

            response.json({
                message: "Venta eliminada correctamente"
            });
        } catch (error) {
            next(error);
        }
    };
}