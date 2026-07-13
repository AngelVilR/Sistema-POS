export interface Evento {
  id: number;
  nombre: string;
  fechaInicio: string; // ISO date string
  fechaFin: string; // ISO date string
  formatoFechaInicio?: String;
  formatoFechaFin?: String;
  ventas?: any[];
  facturasEnc?: any[];
}

export class EventoModel implements Partial<Evento> {
  id: number = 0;
  nombre: string = '';
  fechaInicio: string = new Date().toISOString();
  fechaFin: string = new Date().toISOString();
  formatoFechaInicio?: String = "";
  formatoFechaFin?: String = "";
  ventas?: any[];
  facturasEnc?: any[];

  constructor(data: Partial<Evento> = {}) {
    Object.assign(this, data);
  }

  toJSON(): Evento {
    return {
      id: this.id,
      nombre: this.nombre,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      ventas: this.ventas,
      facturasEnc: this.facturasEnc,
    };
  }
}
