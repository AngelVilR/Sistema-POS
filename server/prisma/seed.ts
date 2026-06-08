import { productos } from "./seeds/productos.js";
import { usuarios } from "./seeds/usuarios.js";
import { eventos } from "./seeds/eventos.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";
dotenv.config();


const dbUrl = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port || 3306),
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace("/", ""),
  connectionLimit: 5,
});


const prisma = new PrismaClient({ adapter });

const main = async () => {
  try {
    await prisma.producto.createMany({
      data: productos,
    });

    await prisma.usuario.createMany({
      data: usuarios,
      skipDuplicates: true
    });

    await prisma.evento.createMany({
      data: eventos,
    });

    await prisma.venta.createMany({
      data: [
        { eventoId: 1, usuarioId: 2, productoId: 1, cantidad: 50 },
        { eventoId: 1, usuarioId: 2, productoId: 2, cantidad: 80 },
        { eventoId: 1, usuarioId: 3, productoId: 3, cantidad: 40 },
        { eventoId: 2, usuarioId: 3, productoId: 4, cantidad: 60 },
        { eventoId: 2, usuarioId: 4, productoId: 5, cantidad: 70 },
        { eventoId: 3, usuarioId: 5, productoId: 6, cantidad: 30 },
        { eventoId: 4, usuarioId: 2, productoId: 3, cantidad: 25 },
      ],
    });

    await prisma.facturaEnc.create({
      data: {
        metodo_pago: "EFECTIVO",
        descuento: null,
        subtotal: 5000,
        impuesto: 650,
        total: 5650,
        hora: new Date(),
        usuarioId: 2,
        eventoId: 1,
        facturasDet: {
          create: [
            {
              productoId: 1,
              cantidad: 2,
              total: 3000,
            },
            {
              productoId: 2,
              cantidad: 4,
              total: 2000,
            },
          ],
        },
      },
    });

    await prisma.facturaEnc.create({
      data: {
        metodo_pago: "TARJETA",
        descuento: null,
        subtotal: 4000,
        impuesto: 520,
        total: 4520,
        hora: new Date(),
        usuarioId: 3,
        eventoId: 2,
        facturasDet: {
          create: [
            {
              productoId: 4,
              cantidad: 4,
              total: 2000,
            },
            {
              productoId: 5,
              cantidad: 2,
              total: 2000,
            },
          ],
        },
      },
    });

    await prisma.facturaEnc.create({
  data: {
    metodo_pago: "TARJETA",
    descuento: "Gelatina 2x1",
    subtotal: 3500,
    impuesto: 455,
    total: 3955,
    hora: new Date(),
    usuarioId: 5,
    eventoId: 3,
    facturasDet: {
      create: [
        {
          productoId: 4, // Gelatina (2x1)
          cantidad: 2,
          total: 500 // solo cobra 1
        },
        {
          productoId: 2,
          cantidad: 4,
          total: 2000
        },
        {
          productoId: 3,
          cantidad: 1,
          total: 1200
        }
      ]
    }
  }
});

await prisma.facturaEnc.create({
  data: {
    metodo_pago: "EFECTIVO",
    descuento: "10%",
    subtotal: 11400 - 1140,
    impuesto: 1333.8,
    total: 11593.8,
    hora: new Date(),
    usuarioId: 4,
    eventoId: 2,
    facturasDet: {
      create: [
        {
          productoId: 1, // Papas
          cantidad: 4,
          total: 6000
        },
        {
          productoId: 5, // Coca Cola
          cantidad: 3,
          total: 3000
        },
        {
          productoId: 6, // Agua
          cantidad: 3,
          total: 2400
        }
      ]
    }
  }
});


  } catch (error) {
    throw error;
  }
};
main().catch((err) => {
  console.warn("Error al ejecutar el seeder:\n", err);
});
