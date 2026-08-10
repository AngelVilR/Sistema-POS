import { Component, computed, inject, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarritoDetalle } from '../../carrito/carrito-detalle/carrito-detalle';
import { CarritoService } from '../../share/carrito.service';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {

  constructor(
    private authService: AuthenticationService,
  ) { }

  public isLogued=computed(()=>{
    const user=this.authService.currentUserSignal()
    console.log('User: ',user?.role.toString())
    return (user?.role.toString() =='ADMIN') || (user?.role.toString() =='USER')
  })
}
