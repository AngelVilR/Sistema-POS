import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarritoDetalle } from '../../carrito/carrito-detalle/carrito-detalle';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(CarritoDetalle);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
