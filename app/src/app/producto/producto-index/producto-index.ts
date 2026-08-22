import { Component, inject, Signal, signal } from '@angular/core';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { VentaService } from '../../share/services/venta.service';
import { VentaModel } from '../../share/models/VentaModel';
import { FormBuilder } from '@angular/forms';
import { CarritoService } from '../../share/carrito.service';
import { ItemCarritoModel } from '../../share/models/ItemCarritoModel';
import { AuthenticationService } from '../../share/authentication.service';

import { ChangeDetectorRef } from '@angular/core';
import { UtilService } from '../../share/util-service';
@Component({
  selector: 'app-producto-index',
  standalone: false,
  templateUrl: './producto-index.html',
  styleUrl: './producto-index.css',
})
export class ProductoIndex {
  datos: VentaModel[] = [];
  datosLength: number = 0;

  private carritoService = inject(CarritoService);
  private authService = inject(AuthenticationService);
  private carritoItemSignal: Signal<ItemCarritoModel[]> = this.carritoService.itemsCarrito;

  user: any;
  userSignal!: () => any;
  private userEmail: any;
  private userEvento = 1;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private pServiceVenta: VentaService,
    private noti: NotificationService,
    private router: Router,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.user = this.authService.currentUserSignal();
    this.userSignal = this.authService.currentUserSignal
    this.userEmail = this.userSignal().email;
    this.listProductos();
  }

  listProductos(): void {
    this.pServiceVenta.get().subscribe({
      next: (list: VentaModel[]) => {
        console.log(list)
        const listUsuarioProds: VentaModel[] = []
        list.forEach(item => {
          if (item.usuario?.email == this.userEmail && item.eventoId == this.userEvento && item.producto?.estado) {
            listUsuarioProds.push(item);
          }
        });

        this.datos = listUsuarioProds;
        this.datosLength = listUsuarioProds.length;

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.datos = [];
        this.datosLength = 0;
      }
    });
  }

  getImgProducto(prProdName: String){
    return this.util.setImgProducto(prProdName);
  }

  addProducto(prProd: VentaModel) {
    let tempItem = this.carritoItemSignal().find(x => {
      return x.producto.productoId === prProd.productoId ? x : null;
    })

    if (tempItem != null) {
      if (tempItem.cantidad >= prProd.cantidad) {
        this.noti.error(
          'Error',
          'Haz superado el stock límite del producto: ' + prProd.producto?.nombre,
          4000
        );
        return;
      }

      console.log('----PRODUCTO AGREGADO AL CARRITO-----', prProd)
      this.noti.success(
        'Carrito actualizado',
        'El producto ' + prProd.producto?.nombre + ' ha cambiado en el carrito',
        4000
      );
      this.carritoService.agregarCarrito(prProd, true);
    } else {
      console.log('----PRODUCTO AGREGADO AL CARRITO-----', prProd)
      this.noti.success(
        'Carrito actualizado',
        'El producto ' + prProd.producto?.nombre + ' se ha agregado al carrito',
        4000
      );
      this.carritoService.agregarCarrito(prProd, true);
    }
  }

  minusProducto(prProd: VentaModel) {
    let tempItem = this.carritoItemSignal().find(x => {
      return x.producto.productoId === prProd.productoId ? x : null;
    })

    if (tempItem == null) {
      this.noti.error(
        'Error',
        'El producto que quieres cambiar no existe en el carrito',
        4000
      );
      return;
    }

    console.log('----PRODUCTO ACTUALIZADO EN EL CARRITO-----', prProd)
    this.noti.success(
      'Carrito actualizado',
      'El producto ' + prProd.producto?.nombre + ' ha cambiado en el carrito',
      5000
    );

    this.carritoService.agregarCarrito(prProd, false);
  }

}
