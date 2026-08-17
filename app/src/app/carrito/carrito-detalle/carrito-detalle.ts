import { Component, effect, inject, Signal, signal } from '@angular/core';
import { CarritoService } from '../../share/carrito.service';
import { ItemCarritoModel } from '../../share/models/ItemCarritoModel';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../share/notification-service';
import { FacturaService } from '../../share/services/factura.service';
import { UtilService } from '../../share/util-service';
import { Subject, takeUntil } from 'rxjs';
import { FacturaModel } from '../../share/models/FacturaModel';
import { VentaService } from '../../share/services/venta.service';
import { VentaModel } from '../../share/models/VentaModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { DialogPagarTarjeta } from '../dialog-pagar-tarjeta/dialog-pagar-tarjeta';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-carrito-detalle',
  standalone: false,
  templateUrl: './carrito-detalle.html',
  styleUrl: './carrito-detalle.css',
})
export class CarritoDetalle {
  destroy$: Subject<boolean> = new Subject<boolean>();
  counter: number | undefined;
  user: any;
  userSignal!: () => any;

  private readonly dialogTarjeta = inject(MatDialog);
  private carritoService = inject(CarritoService)
  private carritoItemSignal: Signal<ItemCarritoModel[]>;

  listItems: ItemCarritoModel[] = [];

  /* prom2x1 = signal<boolean>(this.carritoService.prom2x1);
  prom10k = signal<boolean>(this.carritoService.prom10k); */

  prom2x1: Signal<boolean> = this.carritoService.prom2x1Signal;
  prom10k: Signal<boolean> = this.carritoService.prom10kSignal;

  metodoPago = signal('')
  ventaForm!: FormGroup

  subtotalFinal: Signal<Number> = this.carritoService.subtotalFinal;
  ivaFinal: Signal<Number> = this.carritoService.ivaFinal;
  totalFinal: Signal<Number> = this.carritoService.totalFinal;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private authService: AuthenticationService,
    private facturaService: FacturaService,
    private ventaService: VentaService,
    private noti: NotificationService,
    private util: UtilService,
  ) {
    this.user = this.authService.currentUserSignal();
    this.userSignal = this.authService.currentUserSignal;
    this.carritoItemSignal = this.carritoService.itemsCarrito;
    effect(() => {
      this.getListItems();
    })
    this.initForm();
  }

  private initForm(): void {
    this.ventaForm = this.fb.group({
      rdbgMetodoPago: ['', [Validators.required]],
    })
  }

  getListItems() {
    this.listItems = this.carritoItemSignal();
  }

  labelPromociones(): string {
    let tempTxt = "No posee descuento";
    if (this.prom2x1()) {
      tempTxt = "Descuento de Gelatinas 2x1";
    }

    if (this.prom10k()) {
      tempTxt = "Descuento de compra de más de ₡10,000"
    }
    
    return tempTxt;
  }

  deleteItem(prIdItem: number) {
    this.carritoService.eliminarItemCarrito(prIdItem);
  }

  submitVenta() {
    this.ventaForm.markAllAsTouched();
    if (this.ventaForm.invalid) {
      this.noti.error(
        'Error', 'Verifique los campos marcados en rojo',
        5000
      );
      return;
    }

    this.openDialogTarjeta()
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
    objFactura.metodo_pago = this.metodoPago().toString();
    objFactura.descuento = this.util.PromocionToString(this.prom2x1(), this.prom10k(), this.carritoService.porcentajeDesc().toString());
    objFactura.subtotal = Number(this.subtotalFinal());
    objFactura.impuesto = Number(this.ivaFinal());
    objFactura.total = Number(this.totalFinal());
    objFactura.usuarioId = this.userSignal().id;
    objFactura.eventoId = 1;
    objFactura.facturasDet = tempListDetalle

    this.actualizarCantColab(objFactura);
    this.guardarFactura(objFactura);
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
        this.metodoPago.set("")
        this.carritoService.vaciarCarrito();
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

  private openDialogTarjeta() {
    this.dialogTarjeta.open(DialogPagarTarjeta);
  }

  public errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.ventaForm, controlPath);
  }
}