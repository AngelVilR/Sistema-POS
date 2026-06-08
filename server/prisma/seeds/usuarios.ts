import { Role } from "../../generated/prisma/enums.js";

export const usuarios = [
    
{
      nombre: "Mike Jiménez",
      email: "admin@pos.com",
      telefono: 88880000,
      role: Role.ADMIN,
      password: "123456"
    },
    {
      nombre: "Carlos López",
      email: "carlos@pos.com",
      telefono: 88881111,
      role: Role.USER,
      password: "123456"
    },
    {
      nombre: "María Gómez",
      email: "maria@pos.com",
      telefono: 88882222,
      role: Role.USER,
      password: "123456"
    },
    {
      nombre: "Luis Fernández",
      email: "luis@pos.com",
      telefono: 88883333,
      role: Role.USER,
      password: "123456"
    },
    {
      nombre: "Ana Rodríguez",
      email: "ana@pos.com",
      telefono: 88884444,
      role: Role.USER,
      password: "123456"
    }

]