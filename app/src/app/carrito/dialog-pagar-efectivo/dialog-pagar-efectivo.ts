import { Component, inject, Signal, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { CarritoService } from '../../share/carrito.service';
import { UtilService } from '../../share/util-service';
import { FacturaService } from '../../share/services/factura.service';
import { FacturaModel } from '../../share/models/FacturaModel';
import { ItemCarritoModel } from '../../share/models/ItemCarritoModel';

@Component({
  selector: 'app-dialog-pagar-efectivo',
  standalone: false,
  templateUrl: './dialog-pagar-efectivo.html',
  styleUrl: './dialog-pagar-efectivo.css',
})

export class DialogPagarEfectivo {
  destroy$: Subject<boolean> = new Subject<boolean>();
  readonly dialogEfectivo = inject(MatDialog);

  private carritoService = inject(CarritoService);
  private carritoItemSignal: Signal<ItemCarritoModel[]>;
  private listItems: ItemCarritoModel[] = [];
  private readonly prom2x1 = signal<boolean>(this.carritoService.prom2x1);
  private readonly prom10k = signal<boolean>(this.carritoService.prom10k);
  private readonly subtotalFinal: Signal<Number> = this.carritoService.subtotalFinal;
  private readonly ivaFinal: Signal<Number> = this.carritoService.ivaFinal;
  private readonly totalFinal: Signal<Number> = this.carritoService.totalFinal;

  montoPendientePago: Signal<Number> = this.carritoService.totalFinal;
  cambioSignal = signal<Number>(0);
  validMonto: boolean = true;

  pagarEfectivoForm!: FormGroup

  constructor(
    private facturaService: FacturaService,
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private noti: NotificationService,
    private util: UtilService
  ) {
    this.carritoItemSignal = this.carritoService.itemsCarrito;
    this.listItems = this.carritoItemSignal();
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.pagarEfectivoForm = this.fb.group({
      montoPagar: [null, [Validators.required]],
    })
  }

  submitPagar() {
    this.pagarEfectivoForm.markAllAsTouched();
    if (this.pagarEfectivoForm.invalid) {
      this.noti.error(
        'Error', 'Verifique los campos marcados en rojo',
        5000
      );
      this.validMonto = true
      return;
    }

    //const formValue = this.pagarEfectivoForm.value;
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
    objFactura.metodo_pago = "EFECTIVO";
    objFactura.descuento = this.util.PromocionToString(this.prom2x1(), this.prom10k());
    objFactura.subtotal = Number(this.subtotalFinal());
    objFactura.impuesto = Number(this.ivaFinal());
    objFactura.total = Number(this.totalFinal());
    objFactura.usuarioId = 2;
    objFactura.eventoId = 1;
    objFactura.facturasDet = tempListDetalle

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
        this.dialogEfectivo.closeAll()
        this.carritoService.vaciarCarrito();
        this.goDetailVenta(data.id);
      })
  }

  onChangeCambio(event: any): void {
    const tempMontoPago = Number(event.target.value)
    const tempMontoPendiente = Number(this.montoPendientePago())

    if (tempMontoPago < tempMontoPendiente) {
      this.noti.error(
        'Error',
        'El monto a pagar debe de ser mayor al total de la venta',
        5000
      );
      this.validMonto = true
      return;
    }

    const tempCambio = tempMontoPago - tempMontoPendiente;
    this.cambioSignal.set(tempCambio)
    this.validMonto = false;
  }

  goDetailVenta(prId: number) {
    this.router.navigate(["venta-detail", prId]);
  }

  public errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.pagarEfectivoForm, controlPath);
  }

}
