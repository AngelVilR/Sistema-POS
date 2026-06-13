import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/config/prisma.js";

export class ProductoController {
    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const listado = await prisma.producto.findMany({
                orderBy: {
                    id: "asc"
                },
                include: {
                    ventas: true
                }
            })
            response.json(listado)
        } catch (error) {
            next(error)
        }
    }

}