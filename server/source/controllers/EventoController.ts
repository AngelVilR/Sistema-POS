import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/config/prisma.js";

export class EventoController {

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const listado = await prisma.evento.findMany({
                orderBy: {
                    id: "asc"
                },
                include: {
                    ventas: true,
                    facturasEnc: true
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

            const evento = await prisma.evento.findUnique({
                where: { id },
                include: {
                    ventas: true,
                    facturasEnc: true
                }
            });

            if (!evento) {
                return response.status(404).json({
                    message: "Evento no encontrado"
                });
            }

            response.json(evento);
        } catch (error) {
            next(error);
        }
    };

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { nombre, fechaInicio, fechaFin } = request.body;

            const evento = await prisma.evento.create({
                data: {
                    nombre,
                    fechaInicio: new Date(fechaInicio),
                    fechaFin: new Date(fechaFin)
                }
            });

            response.status(201).json(evento);
        } catch (error) {
            next(error);
        }
    };

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            const evento = await prisma.evento.update({
                where: { id },
                data: request.body
            });

            response.json(evento);
        } catch (error) {
            next(error);
        }
    };

    delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            await prisma.evento.delete({
                where: { id }
            });

            response.json({
                message: "Evento eliminado correctamente"
            });
        } catch (error) {
            next(error);
        }
    };
}