import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarritoRoutingModule } from './carrito-routing-module';
import { CarritoDetalle } from './carrito-detalle/carrito-detalle';
import { CarritoProcesarPago } from './carrito-procesar-pago/carrito-procesar-pago';

@NgModule({
  declarations: [CarritoDetalle, CarritoProcesarPago],
  imports: [CommonModule, CarritoRoutingModule],
})
export class CarritoModule {}
