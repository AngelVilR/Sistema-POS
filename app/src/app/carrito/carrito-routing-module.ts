import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarritoDetalle } from './carrito-detalle/carrito-detalle';
import { CarritoProcesarPago } from './carrito-procesar-pago/carrito-procesar-pago';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  { path: 'carrito', 
    component: CarritoDetalle,
    canActivate: [authGuard],
    data: {roles: ['ADMIN', 'USER']}
  },
  { path: 'procesar-pago', 
    component: CarritoProcesarPago,
    canActivate: [authGuard],
    data: {roles: ['ADMIN', 'USER']} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritoRoutingModule {}
