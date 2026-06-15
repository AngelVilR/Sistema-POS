import { Evento } from './EventoModel';
import { Usuario } from './UsuarioModel';
import { Producto } from './ProductoModel';

export interface Venta {
  eventoId: number;
  usuarioId: number;
  productoId: number;
  cantidad: number;
  evento?: Evento;
  usuario?: Usuario;
  producto?: Producto;
}

export class VentaModel implements Partial<Venta> {
  eventoId: number = 0;
  usuarioId: number = 0;
  productoId: number = 0;
  cantidad: number = 0;
  evento?: Evento;
  usuario?: Usuario;
  producto?: Producto;

  constructor(data: Partial<Venta> = {}) {
    Object.assign(this, data);
  }

  toJSON(): Venta {
    return {
      eventoId: this.eventoId,
      usuarioId: this.usuarioId,
      productoId: this.productoId,
      cantidad: this.cantidad,
      evento: this.evento,
      usuario: this.usuario,
      producto: this.producto,
    };
  }
}
