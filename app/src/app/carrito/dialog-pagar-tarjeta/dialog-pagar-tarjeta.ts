import { Component, inject, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../share/notification-service';
import { ItemCarritoModel } from '../../share/models/ItemCarritoModel';
import { CarritoService } from '../../share/carrito.service';
import { ProductoIndex } from '../../producto/producto-index/producto-index';
import { VentaModel } from '../../share/models/VentaModel';
import { Factura, FacturaModel } from '../../share/models/FacturaModel';
import { UtilService } from '../../share/util-service';
import { FacturaService } from '../../share/services/factura.service';
import { Subject, takeUntil } from 'rxjs';
import { VentaService } from '../../share/services/venta.service';
import { ProductoService } from '../../share/services/producto.service';
import { ProductoModel } from '../../share/models/ProductoModel';

@Component({
  selector: 'app-dialog-pagar-tarjeta',
  standalone: false,
  templateUrl: './dialog-pagar-tarjeta.html',
  styleUrl: './dialog-pagar-tarjeta.css',
})
export class DialogPagarTarjeta {
  destroy$: Subject<boolean> = new Subject<boolean>();
  readonly dialogTarjeta = inject(MatDialog);
  counter: number | undefined;

  private carritoService = inject(CarritoService)
  private carritoItemSignal: Signal<ItemCarritoModel[]>;
  private listItems: ItemCarritoModel[] = [];
  private readonly prom2x1 = signal<boolean>(this.carritoService.prom2x1);
  private readonly prom10k = signal<boolean>(this.carritoService.prom10k);
  private readonly subtotalFinal: Signal<Number> = this.carritoService.subtotalFinal;
  private readonly ivaFinal: Signal<Number> = this.carritoService.ivaFinal;
  private readonly totalFinal: Signal<Number> = this.carritoService.totalFinal;

  constructor(
    private facturaService: FacturaService,
    private ventaService: VentaService,
    private router: Router,
    private noti: NotificationService,
    private util: UtilService
  ) {
    this.carritoItemSignal = this.carritoService.itemsCarrito;
    this.listItems = this.carritoItemSignal();
  }

  ngOnInit() {
    this.terminarVenta();
  }

  terminarVenta() {
    this.counter = window.setTimeout(() => {
      if (this.listItems.length <= 0) {
        this.noti.error(
          'Error',
          'La venta no se puede realizar hasta que carrito tenga mínimo un producto',
          5000
        );
      }

      let fechaAct = new Date()

      let tempListDetalle: any[] = this.listItems.map((x: ItemCarritoModel) => ({
        pedidoId: 0,
        productoId: x.producto.productoId,
        cantidad: x.cantidad,
        total: x.subtotal
      }) as any
      );

      //Crear obj Venta
      const objFactura = new FacturaModel();
      objFactura.fecha = fechaAct.toISOString();
      objFactura.hora = fechaAct.getHours + ":" + fechaAct.getMinutes + ":" + fechaAct.getSeconds;
      objFactura.metodo_pago = "TARJETA";
      objFactura.descuento = this.util.PromocionToString(this.prom2x1(), this.prom10k());
      objFactura.subtotal = Number(this.subtotalFinal());
      objFactura.impuesto = Number(this.ivaFinal());
      objFactura.total = Number(this.totalFinal());
      objFactura.usuarioId = 2;
      objFactura.eventoId = 1;
      objFactura.facturasDet = tempListDetalle

      this.actualizarCantColab(objFactura);
      this.guardarFactura(objFactura);
    }, 4000);
  }

  guardarFactura(prFactura: FacturaModel) {
    this.facturaService
      .create(prFactura)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.noti.success(
          'Venta finalizada',
          'Se ha completado el pago exitosamente',
          5000
        );
        console.log('---FACTURA---')
        console.log(data)
        this.dialogTarjeta.closeAll();
        this.carritoService.vaciarCarrito();
        this.goDetailVenta(data.id);
      })
  }

  actualizarCantColab(prFactura: FacturaModel) {
    let objVenta = null;
    let nuevaCant = 0;

    prFactura.facturasDet?.forEach((x: VentaModel) => {
      this.ventaService
        .getByIdVenta(prFactura.eventoId, prFactura.usuarioId, x.productoId)
        .subscribe((data: VentaModel) => {
          nuevaCant = Number(data.cantidad - x.cantidad);

          objVenta = {
            eventoId: prFactura.eventoId,
            usuarioId: prFactura.usuarioId,
            productoId: x.productoId,
            cantidad: nuevaCant > 0 ? nuevaCant : 0,
          }

          if (objVenta != null) {
            this.ventaService
              .updateVenta(objVenta, objVenta.eventoId, objVenta.usuarioId, objVenta.productoId)
              .pipe(takeUntil(this.destroy$))
              .subscribe((data: VentaModel) => {
              })
          }
        })
    })
  }

  cancelarVenta() {
    clearTimeout(this.counter);
  }

  goDetailVenta(prId: number) {
    this.router.navigate(["venta-detail", prId]);
  }
}
