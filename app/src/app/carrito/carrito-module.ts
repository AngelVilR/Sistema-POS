import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Diseño */
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
/* Formulario */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Ruoutes */
import { CarritoRoutingModule } from './carrito-routing-module';
import { CarritoDetalle } from './carrito-detalle/carrito-detalle';
import { CarritoProcesarPago } from './carrito-procesar-pago/carrito-procesar-pago';
import { MatIcon } from '@angular/material/icon';
import { DialogPagarTarjeta } from './dialog-pagar-tarjeta/dialog-pagar-tarjeta';
import { DialogPagarEfectivo } from './dialog-pagar-efectivo/dialog-pagar-efectivo';

@NgModule({
  declarations: [CarritoDetalle, CarritoProcesarPago, DialogPagarTarjeta, DialogPagarEfectivo],
  imports: [
    CommonModule,
    CarritoRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,    
  ],
  exports: [DialogPagarTarjeta, DialogPagarEfectivo],
})
export class CarritoModule { }
