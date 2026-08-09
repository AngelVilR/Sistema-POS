import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/config/prisma.js";
import bcrypt from "bcryptjs";
import { Role } from "../../generated/prisma/enums.js";
import passport from "../config/passport.js";
import { generateToken } from "../config/authUtils.js";
import { Usuario } from "../../generated/prisma/client.js";

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

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const usuario = await prisma.usuario.create({
                data: {
                    nombre,
                    email,
                    telefono,
                    password: hash,
                    role : Role[role as keyof typeof Role] // Convertir el string a enum
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

    updatePassword = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;
      const {password} = request.body;
      const idUser = Number(request.params.id);

      const userActual = await prisma.usuario.findUnique({
        where: { id: idUser }
        
      });

      if (!userActual) {
        response.status(404).json({message: "El usuario no existe"});
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const updatePass = await prisma.usuario.update({
        where: { id: idUser},
        data: {
        password: hash
      },
      });

      response.json(updatePass);

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

login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      async (
        err: Error | null,
        user: Express.User | false | null,
        info: { message?: string }
      ) => {
        if (err) return next(err);
        if (!user) {
          return res
            .status(401)
            .json({ success: false, message: info.message });
        }

        try {
          const token = generateToken(user as Usuario);
          return res.json({
            success: true,
            message: "Inicio de sesión exitoso",
            token,
          });
        } catch (error) {
          next(error);
        }
      }
    )(req, res, next);
  };


  userAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = req.user as Usuario;
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  };
}