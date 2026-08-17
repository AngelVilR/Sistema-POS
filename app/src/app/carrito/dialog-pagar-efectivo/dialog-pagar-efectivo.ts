import { Component, inject, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { CarritoService } from '../../share/carrito.service';
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

  montoPendientePago: Signal<Number> = this.carritoService.subtotalFinal;
  cambioSignal = signal<Number>(0);
  validMonto: boolean = true;

  pagarEfectivoForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private noti: NotificationService,
  ) {
    this.carritoItemSignal = this.carritoService.itemsCarrito;    
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.pagarEfectivoForm = this.fb.group({
      montoPagar: [null, [Validators.required]],
    })
  }

  onChangeCambio(event: any): void {
    const tempMontoPago = Number(event.target.value)
    const tempMontoPendiente = Number(this.montoPendientePago())

    this.pagarEfectivoForm.markAllAsTouched();
    if (this.pagarEfectivoForm.invalid) {
      this.noti.error(
        'Error', 'Verifique los campos marcados en rojo',
        5000
      );
      this.validMonto = true
      return;
    }

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

  public errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.pagarEfectivoForm, controlPath);
  }
}
