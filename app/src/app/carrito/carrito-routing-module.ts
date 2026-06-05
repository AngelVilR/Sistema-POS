import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarritoDetalle } from './carrito-detalle/carrito-detalle';
import { CarritoProcesarPago } from './carrito-procesar-pago/carrito-procesar-pago';

const routes: Routes = [
  { path: 'carrito', component: CarritoDetalle },
  { path: 'procesar-pago', component: CarritoProcesarPago},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritoRoutingModule {}
