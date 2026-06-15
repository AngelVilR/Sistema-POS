export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  estado: boolean;
  ventas?: any[];
  facturasDet?: any[];
}

export class ProductoModel implements Partial<Producto> {
  id: number = 0;
  nombre: string = '';
  precio: number = 0;
  stock: number = 0;
  estado: boolean = true;
  ventas?: any[];
  facturasDet?: any[];

  constructor(data: Partial<Producto> = {}) {
    Object.assign(this, data);
  }

  toJSON(): Producto {
    return {
      id: this.id,
      nombre: this.nombre,
      precio: this.precio,
      stock: this.stock,
      estado: this.estado,
      ventas: this.ventas,
      facturasDet: this.facturasDet,
    };
  }
}
