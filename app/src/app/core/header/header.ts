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
}
