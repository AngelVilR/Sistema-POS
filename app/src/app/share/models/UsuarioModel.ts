export type Role = 'USER' | 'ADMIN';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: number;
  role: Role;
  password: string;
  ventas?: any[];
  facturasEnc?: any[];
}

export class UsuarioModel implements Partial<Usuario> {
  id: number = 0;
  nombre: string = '';
  email: string = '';
  telefono: number = 0;
  role: Role = 'USER';
  password: string = '';
  ventas?: any[];
  facturasEnc?: any[];

  constructor(data: Partial<Usuario> = {}) {
    Object.assign(this, data);
  }

  toJSON(): Usuario {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      role: this.role,
      password: this.password,
      ventas: this.ventas,
      facturasEnc: this.facturasEnc,
    };
  }
}
