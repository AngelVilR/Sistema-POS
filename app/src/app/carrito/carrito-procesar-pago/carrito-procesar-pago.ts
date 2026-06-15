import { Component, inject } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { DialogPagarEfectivo } from '../dialog-pagar-efectivo/dialog-pagar-efectivo';
import { DialogPagarTarjeta } from '../dialog-pagar-tarjeta/dialog-pagar-tarjeta';

@Component({
  selector: 'app-carrito-procesar-pago',
  standalone: false,
  templateUrl: './carrito-procesar-pago.html',
  styleUrl: './carrito-procesar-pago.css',
})
export class CarritoProcesarPago {
  readonly dialogEfectivo = inject(MatDialog);

  openDialogEfectivo() {
    this.dialogEfectivo.open(DialogPagarEfectivo);
  }

  readonly dialogTarjeta = inject(MatDialog);

  openDialogTarjeta() {
    this.dialogTarjeta.open(DialogPagarTarjeta);
  }
}
