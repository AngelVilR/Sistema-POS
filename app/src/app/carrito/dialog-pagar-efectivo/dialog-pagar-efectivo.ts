import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';

@Component({
  selector: 'app-dialog-pagar-efectivo',
  standalone: false,
  templateUrl: './dialog-pagar-efectivo.html',
  styleUrl: './dialog-pagar-efectivo.css',
})

export class DialogPagarEfectivo {
  destroy$: Subject<boolean> = new Subject<boolean>();

  montoPendientePago: number = 10000;
  cambioSignal = signal<Number>(0);

  pagarEfectivoForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    /* private ventaService: VentaService, */
    private noti: NotificationService
  ) { }

  ngOnInit() {
    this.initForm();

  }

  private initForm(): void {
    this.pagarEfectivoForm = this.fb.group({
      montoPendiente: [this.montoPendientePago],
      montoPagar: [null, [Validators.required]],
    })
    this.pagarEfectivoForm.get('montoPendiente')?.disable()
  }

  submitPagar() {
    this.pagarEfectivoForm.markAllAsTouched();
    /* if (this.pagarEfectivoForm.invalid) {
      this.noti.error(
        'Error', 'Verifique los campos marcados en rojo',
        5000
      );
      return;
    } */

    const formValue = this.pagarEfectivoForm.value;
    this.goVentaDetail();
  }

  onChangeCambio(prTotalVenta: number, event: any): void {
    const tempMontoPago = Number(event.target.value)
    if (tempMontoPago < prTotalVenta) {
      this.noti.error(
        'Error',
        'El monto a pagar debe de ser mayor al total de la venta',
        5000
      );
      return;
    }

    const tempCambio = tempMontoPago - prTotalVenta
    this.cambioSignal.set(tempCambio)
  }

  goVentaDetail(){
    this.router.navigate(['/venta-detail']);
  }

  public errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.pagarEfectivoForm, controlPath);
  }

}
