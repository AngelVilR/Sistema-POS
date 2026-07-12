import { Component, ViewChild } from '@angular/core';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventoService } from '../../share/services/evento.service';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoModel } from '../../share/models/EventoModel';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-evento-admin',
  standalone: false,
  templateUrl: './evento-admin.html',
  styleUrl: './evento-admin.css',
})


export class EventoAdmin {

minFechaInicio = new Date();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<EventoModel>();

  destroy$: Subject<boolean> = new Subject<boolean>();

  displayedColumns = ['nombre', 'fechaInicio', 'fechaFin', 'acciones'];

  eventoForm!: FormGroup;
  isEditing = false;
  selectedEvento: EventoModel | null = null;

  constructor(
    private fb: FormBuilder,
    private eService: EventoService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Items';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Inicio';
    this.paginator._intl.lastPageLabel = 'Fin';

    this.initForm();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.listEventos();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
  private listEventos(): void {
    this.eService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: () => {
          this.noti.error('Error', 'Error al cargar los eventos');
        },
      });
  }

  crearEvento(): void {
    this.isEditing = false;
    this.selectedEvento = null;

    this.eventoForm.reset({
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
    });
  }

  actualizarEvento(evento: EventoModel): void {
    this.isEditing = true;
    this.selectedEvento = evento;

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

    if (this.isEditing && this.selectedEvento) {

      const eventoActualizado = new EventoModel({
        id: this.selectedEvento.id,
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

            this.listEventos();
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
        fechaFin:formValue.fechaFin,
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

            this.listEventos();
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
    this.selectedEvento = null;

    this.eventoForm.reset({
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
    });
  }
  
  
  eliminarEvento(evento: EventoModel): void {

  const confirmacion = confirm(
    `¿Está seguro de eliminar el evento "${evento.nombre}"?`
  );

  if (!confirmacion) return;

  this.eService
    .delete(evento)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.noti.success(
          'Éxito',
          'Evento eliminado correctamente'
        );

        this.listEventos();
      },
      error: () => {
        this.noti.error(
          'Error',
          'Error al eliminar el evento'
        );
      },
    });
}

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

  private formatDate(date: Date | string): string {

    const d = new Date(date);

    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

}
