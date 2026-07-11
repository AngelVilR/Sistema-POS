import { Component, effect, inject, Signal, signal } from '@angular/core';
import { CarritoService } from '../../share/carrito.service';
import { ItemCarritoModel } from '../../share/models/ItemCarritoModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../share/notification-service';
import { FacturaService } from '../../share/services/factura.service';
import { UtilService } from '../../share/util-service';

@Component({
  selector: 'app-carrito-detalle',
  standalone: false,
  templateUrl: './carrito-detalle.html',
  styleUrl: './carrito-detalle.css',
})
export class CarritoDetalle {
  private carritoService = inject(CarritoService)
  private carritoItemSignal: Signal<ItemCarritoModel[]>;

  listItems: ItemCarritoModel[] = [];    

  prom2x1 = signal<boolean>(this.carritoService.prom2x1);
  prom10k = signal<boolean>(this.carritoService.prom10k);

  subtotalFinal: Signal<Number> = this.carritoService.subtotalFinal;
  ivaFinal: Signal<Number> = this.carritoService.ivaFinal;
  totalFinal: Signal<Number> = this.carritoService.totalFinal;  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private facturaService: FacturaService,
    private noti: NotificationService,
    private util: UtilService,
  ) {
    this.carritoItemSignal = this.carritoService.itemsCarrito;
    effect(() => {
      this.getListItems();
    })
  }

  getListItems() {
    this.listItems = this.carritoItemSignal();
  }

  labelPromociones(): string {
    let tempTxt = this.util.PromocionToString(this.prom2x1(), this.prom10k());
    return tempTxt;
  }

  deleteItem(prIdItem: number) {
    this.carritoService.eliminarItemCarrito(prIdItem);
  }
}