import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/config/prisma.js";

export class UsuarioController {

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const listado = await prisma.usuario.findMany({
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

            const usuario = await prisma.usuario.findUnique({
                where: { id },
                include: {
                    ventas: true,
                    facturasEnc: true
                }
            });

            if (!usuario) {
                return response.status(404).json({
                    message: "Usuario no encontrado"
                });
            }

            response.json(usuario);
        } catch (error) {
            next(error);
        }
    };

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { nombre, email, telefono, password, role } = request.body;

            const usuario = await prisma.usuario.create({
                data: {
                    nombre,
                    email,
                    telefono,
                    password,
                    role
                }
            });

            response.status(201).json(usuario);
        } catch (error) {
            next(error);
        }
    };

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            const usuario = await prisma.usuario.update({
                where: { id },
                data: request.body
            });

            response.json(usuario);
        } catch (error) {
            next(error);
        }
    };

    delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            await prisma.usuario.delete({
                where: { id }
            });

            response.json({
                message: "Usuario eliminado correctamente"
            });
        } catch (error) {
            next(error);
        }
    };

    checkEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params as { email: string };
    const user = await prisma.usuario.findUnique({
      where: { email }
    });
    res.json(!!user); // true si existe, false si no
  } catch (error) {
    next(error);
  }
};


}