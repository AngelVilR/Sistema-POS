import { Component, inject, Signal, signal } from '@angular/core';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { VentaService } from '../../share/services/venta.service';
import { VentaModel } from '../../share/models/VentaModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarritoService } from '../../share/carrito.service';
import { ItemCarritoModel } from '../../share/models/ItemCarritoModel';
import { ProductoModel } from '../../share/models/ProductoModel';

@Component({
  selector: 'app-producto-index',
  standalone: false,
  templateUrl: './producto-index.html',
  styleUrl: './producto-index.css',
})
export class ProductoIndex {
  datos: any;
  datosLength: any;

  private carritoService = inject(CarritoService);
  private carritoItemSignal: Signal<ItemCarritoModel[]> = this.carritoService.itemsCarrito;

  private userEmail: any = "carlos@pos.com";
  private userEvento = 1;

  constructor(
    private fb: FormBuilder,
    private pServiceVenta: VentaService,
    private noti: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.listProductos();
  }

  listProductos() {
    this.pServiceVenta
      .get()
      .subscribe((list: VentaModel[]) => {

        const listUsuarioProds: VentaModel[] = []
        list.forEach(item => {
          if (item.usuario?.email == this.userEmail && item.eventoId == this.userEvento) {
            listUsuarioProds.push(item);
          }
        });

        this.datos = listUsuarioProds
        this.datosLength = listUsuarioProds.length
      })
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
