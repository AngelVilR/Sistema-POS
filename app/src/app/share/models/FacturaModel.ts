import { Usuario } from './UsuarioModel';
import { Evento } from './EventoModel';

export interface Factura {
  id: number;
  fecha: string; // ISO date string
  hora: string; // ISO time string
  metodo_pago: string;
  descuento?: string | null;
  subtotal: number;
  impuesto: number;
  total: number;
  usuarioId: number;
  usuario?: Usuario;
  eventoId: number;
  evento?: Evento;
  facturasDet?: any[];
}

export class FacturaModel implements Partial<Factura> {
  id: number = 0;
  fecha: string = new Date().toISOString();
  hora: string = new Date().toISOString();
  metodo_pago: string = '';
  descuento?: string | null;
  subtotal: number = 0;
  impuesto: number = 0;
  total: number = 0;
  usuarioId: number = 0;
  usuario?: Usuario;
  eventoId: number = 0;
  evento?: Evento;
  facturasDet?: any[];

  constructor(data: Partial<Factura> = {}) {
    Object.assign(this, data);
  }

  toJSON(): Factura {
    return {
      id: this.id,
      fecha: this.fecha,
      hora: this.hora,
      metodo_pago: this.metodo_pago,
      descuento: this.descuento ?? null,
      subtotal: this.subtotal,
      impuesto: this.impuesto,
      total: this.total,
      usuarioId: this.usuarioId,
      usuario: this.usuario,
      eventoId: this.eventoId,
      evento: this.evento,
      facturasDet: this.facturasDet,
    };
  }
}
