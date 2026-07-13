import { Component, Inject, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EventoModel } from '../../share/models/EventoModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from '../../share/services/evento.service';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../share/util-service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-evento-form',
  standalone: false,
  templateUrl: './evento-form.html',
  styleUrl: './evento-form.css',
})
export class EventoForm {
  minFechaInicio = new Date();

  destroy$: Subject<boolean> = new Subject<boolean>();

  eventoForm!: FormGroup;
  isEditing = false;

  private readonly dialogService = inject(MatDialog);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EventoModel | null,
    private fb: FormBuilder,
    private eService: EventoService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.data == null
      ? this.crearEvento()
      : this.actualizarEvento(this.data)
  }

  private initForm(): void {
    this.eventoForm = this.fb.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
        ],
        fechaInicio: ['', [
          Validators.required,
          this.validarFechaActual
        ]],
        fechaFin: ['', Validators.required],
      },
      {
        validators: this.validarFechas
      }
    );
  }

  crearEvento(): void {
    this.isEditing = false;
    this.data = null;
    this.eventoForm.reset({
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
    });
  }

  actualizarEvento(evento: EventoModel): void {
    this.isEditing = true;
    this.data = evento;

    this.eventoForm.patchValue({
      nombre: evento.nombre,
      fechaInicio: this.formatDate(evento.fechaInicio),
      fechaFin: this.formatDate(evento.fechaFin),
    });
  }

  guardarEvento(): void {
    this.eventoForm.markAllAsTouched();

    if (this.eventoForm.invalid) {
      this.noti.error(
        'Error',
        'Verifique los campos marcados en rojo',
        5000
      );
      return;
    }

    const formValue = this.eventoForm.value;

    if (this.isEditing && this.data) {
      const eventoActualizado = new EventoModel({
        id: this.data.id,
        nombre: formValue.nombre,
        fechaInicio: formValue.fechaInicio,
        fechaFin: formValue.fechaFin,
      });

      this.eService
        .update(eventoActualizado)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.noti.success(
              'Éxito',
              'Evento actualizado correctamente'
            );
            this.cancelarEdicion();
            this.dialogService.closeAll();
          },
          error: () => {
            this.noti.error(
              'Error',
              'Error al actualizar el evento'
            );
          },
        });
    } else {
      const nuevoEvento = new EventoModel({
        nombre: formValue.nombre,
        fechaInicio: formValue.fechaInicio,
        fechaFin: formValue.fechaFin,
      });

      this.eService
        .create(nuevoEvento)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.noti.success(
              'Éxito',
              'Evento creado correctamente'
            );
            this.cancelarEdicion();
            this.dialogService.closeAll();
          },
          error: () => {
            this.noti.error(
              'Error',
              'Error al crear el evento'
            );
          },
        });
    }
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.data = null;

    this.eventoForm.reset({
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
    });

    this.dialogService.closeAll();
  }

  private validarFechaActual = (control: any) => {
    if (!control.value) {
      return null;
    }
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      return { fechaPasada: true };
    }

    return null;
  };

  private validarFechas = (form: FormGroup) => {
    const fechaInicio = form.get('fechaInicio')?.value;
    const fechaFin = form.get('fechaFin')?.value;

    if (!fechaInicio || !fechaFin) {
      return null;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (fin < inicio) {
      return { fechaInvalida: true };
    }

    return null;
  };

  errorHandling(controlName: string): string | false {
    const control = this.eventoForm.get(controlName);

    if (
      !control ||
      !control.invalid ||
      (!control.dirty && !control.touched)
    ) {
      return false;
    }

    if (control.errors?.['required'])
      return 'Este campo es requerido';

    if (control.errors?.['minlength'])
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;

    if (control.errors?.['maxlength'])
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;

    return false;
  }

  private formatDate(date: Date | string): Date {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return new Date(year, month, day, hours, minutes);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
