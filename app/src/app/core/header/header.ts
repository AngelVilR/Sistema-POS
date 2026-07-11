import { Component, inject, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarritoDetalle } from '../../carrito/carrito-detalle/carrito-detalle';
import { CarritoService } from '../../share/carrito.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  readonly dialog = inject(MatDialog);

  private carritoService = inject(CarritoService)
  cantItems: Signal<Number> = this.carritoService.cantItems


  openDialog() {
    const dialogRef = this.dialog.open(CarritoDetalle);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
