import {
  Component,
  Inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { EventoModel } from '../../share/models/EventoModel';
import { EventoService } from '../../share/services/evento.service';
import { NotificationService } from '../../share/notification-service';


@Component({
  selector: 'app-evento-form',
  standalone: false,
  templateUrl: './evento-form.html',
  styleUrl: './evento-form.css',
})
export class EventoForm {

  /**
   * Fecha mínima permitida para crear eventos.
   */
  minFechaInicio: Date = new Date();

  /**
   * Fecha mínima de finalización.
   */
  minFechaFin: Date = new Date();

  /**
   * Control de destrucción de observables.
   */
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * Formulario.
   */
  eventoForm!: FormGroup;

  /**
   * Indica si estamos creando o editando.
   */
  isEditing = false;


  constructor(

    @Inject(MAT_DIALOG_DATA)
    public data: EventoModel | null,

    private fb: FormBuilder,

    private eService: EventoService,

    private noti: NotificationService,

    private cdr: ChangeDetectorRef,

    private dialogRef: MatDialogRef<EventoForm>

  ) {}



  ngOnInit(): void {

    /*
     * Ponemos la fecha de hoy a medianoche.
     */
    this.minFechaInicio = this.obtenerFechaHoy();

    this.minFechaFin = this.obtenerFechaHoy();

    /*
     * Inicializamos formulario.
     */
    this.initForm();


    /*
     * Si recibimos data estamos editando.
     */
    if (this.data) {

      this.actualizarEvento(this.data);

    } else {

      this.crearEvento();

    }


    /*
     * Forzamos la actualización visual.
     */
    this.cdr.detectChanges();

  }



  /**
   * Inicializa el formulario.
   */
  private initForm(): void {

    this.eventoForm = this.fb.group(

      {

        nombre: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100)
          ]
        ],


        fechaInicio: [
          null,
          [
            Validators.required,
            this.validarFechaActual
          ]
        ],


        fechaFin: [
          null,
          [
            Validators.required
          ]
        ]

      },

      {
        validators: this.validarFechas
      }

    );

  }



  /**
   * Preparar formulario para crear.
   */
  crearEvento(): void {

    this.isEditing = false;

    this.data = null;

    this.eventoForm.reset({

      nombre: '',

      fechaInicio: null,

      fechaFin: null

    });

    this.minFechaInicio = this.obtenerFechaHoy();

    this.minFechaFin = this.obtenerFechaHoy();

    this.cdr.detectChanges();

  }



  /**
   * Preparar formulario para actualizar.
   */
  actualizarEvento(evento: EventoModel): void {

    this.isEditing = true;

    this.data = evento;


    const fechaInicio = this.formatDate(evento.fechaInicio);

    const fechaFin = this.formatDate(evento.fechaFin);


    this.eventoForm.patchValue({

      nombre: evento.nombre,

      fechaInicio: fechaInicio,

      fechaFin: fechaFin

    });


    /*
     * En edición permitimos que la fecha actual
     * del evento siga siendo seleccionable.
     */
    this.minFechaInicio = fechaInicio;

    this.minFechaFin = fechaInicio;


    this.eventoForm.updateValueAndValidity();


    this.cdr.detectChanges();

  }



  /**
   * Guardar evento.
   */
  guardarEvento(): void {

    /*
     * Mostramos todos los errores.
     */
    this.eventoForm.markAllAsTouched();

    this.eventoForm.updateValueAndValidity();


    /*
     * Validamos formulario.
     */
    if (this.eventoForm.invalid) {

      this.noti.error(
        'Error',
        'Verifique los campos marcados en rojo',
        5000
      );

      this.cdr.detectChanges();

      return;

    }


    const formValue = this.eventoForm.value;


    /*
     * ============================
     * ACTUALIZAR
     * ============================
     */
    if (this.isEditing && this.data) {

      const eventoActualizado = new EventoModel({

        id: this.data.id,

        nombre: formValue.nombre,

        fechaInicio: formValue.fechaInicio,

        fechaFin: formValue.fechaFin

      });


      console.log(
        'Evento que se va a actualizar:',
        eventoActualizado
      );


      this.eService
        .update(eventoActualizado)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe({

          next: (respuesta) => {

            console.log(
              'Evento actualizado:',
              respuesta
            );


            this.noti.success(
              'Éxito',
              'Evento actualizado correctamente',
              3000
            );


            /*
             * true significa:
             * "el administrador debe volver a cargar la lista".
             */
            this.dialogRef.close(true);

          },


          error: (error) => {

            console.error(
              'Error actualizando evento:',
              error
            );


            this.noti.error(
              'Error',
              'Error al actualizar el evento',
              5000
            );

          }

        });


      return;

    }



    /*
     * ============================
     * CREAR
     * ============================
     */

    const nuevoEvento = new EventoModel({

      nombre: formValue.nombre,

      fechaInicio: formValue.fechaInicio,

      fechaFin: formValue.fechaFin

    });


    console.log(
      'Evento que se va a crear:',
      nuevoEvento
    );


    this.eService
      .create(nuevoEvento)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Evento creado:',
            respuesta
          );


          this.noti.success(
            'Éxito',
            'Evento creado correctamente',
            3000
          );


          /*
           * Cerramos el diálogo enviando true.
           */
          this.dialogRef.close(true);

        },


        error: (error) => {

          console.error(
            'Error creando evento:',
            error
          );


          this.noti.error(
            'Error',
            'Error al crear el evento',
            5000
          );

        }

      });

  }



  /**
   * Cancelar edición/creación.
   */
  cancelarEdicion(): void {

    this.dialogRef.close(false);

  }



  /**
   * Valida que la fecha de inicio no sea anterior
   * a hoy.
   *
   * En edición permitimos mantener la fecha original.
   */
  private validarFechaActual = (control: any) => {

    if (!control.value) {

      return null;

    }


    const fechaSeleccionada =
      this.normalizarFecha(control.value);


    const hoy =
      this.obtenerFechaHoy();


    /*
     * Si estamos editando y la fecha seleccionada
     * es la fecha original del evento,
     * permitimos mantenerla.
     */
    if (
      this.isEditing &&
      this.data &&
      this.data.fechaInicio
    ) {

      const fechaOriginal =
        this.normalizarFecha(
          this.data.fechaInicio
        );


      if (
        this.mismaFecha(
          fechaSeleccionada,
          fechaOriginal
        )
      ) {

        return null;

      }

    }


    if (fechaSeleccionada < hoy) {

      return {
        fechaPasada: true
      };

    }


    return null;

  };



  /**
   * Valida que fecha fin no sea anterior
   * a fecha inicio.
   */
  private validarFechas = (form: FormGroup) => {

    const fechaInicio =
      form.get('fechaInicio')?.value;

    const fechaFin =
      form.get('fechaFin')?.value;


    if (!fechaInicio || !fechaFin) {

      return null;

    }


    const inicio =
      this.normalizarFecha(fechaInicio);

    const fin =
      this.normalizarFecha(fechaFin);


    if (fin < inicio) {

      return {
        fechaInvalida: true
      };

    }


    return null;

  };



  /**
   * Mensajes de validación.
   */
  errorHandling(controlName: string): string | false {

    const control =
      this.eventoForm.get(controlName);


    if (
      !control ||
      !control.invalid ||
      (!control.dirty && !control.touched)
    ) {

      return false;

    }


    if (
      control.errors?.['required']
    ) {

      return 'Este campo es requerido';

    }


    if (
      control.errors?.['minlength']
    ) {

      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;

    }


    if (
      control.errors?.['maxlength']
    ) {

      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;

    }


    if (
      control.errors?.['fechaPasada']
    ) {

      return 'No puede seleccionar una fecha anterior a hoy';

    }


    return false;

  }



  /**
   * Convierte fecha recibida del backend
   * en Date local.
   */
  private formatDate(
    date: Date | string
  ): Date {

    const d = new Date(date);


    return new Date(

      d.getFullYear(),

      d.getMonth(),

      d.getDate(),

      d.getHours(),

      d.getMinutes(),

      d.getSeconds()

    );

  }



  /**
   * Obtiene la fecha actual sin hora.
   */
  private obtenerFechaHoy(): Date {

    const hoy = new Date();

    hoy.setHours(
      0,
      0,
      0,
      0
    );

    return hoy;

  }



  /**
   * Normaliza una fecha para comparar
   * únicamente año, mes y día.
   */
  private normalizarFecha(
    fecha: Date | string
  ): Date {

    const resultado =
      new Date(fecha);


    resultado.setHours(
      0,
      0,
      0,
      0
    );


    return resultado;

  }



  /**
   * Compara dos fechas ignorando la hora.
   */
  private mismaFecha(
    fecha1: Date,
    fecha2: Date
  ): boolean {

    return (

      fecha1.getFullYear() ===
      fecha2.getFullYear()

      &&

      fecha1.getMonth() ===
      fecha2.getMonth()

      &&

      fecha1.getDate() ===
      fecha2.getDate()

    );

  }



  ngOnDestroy(): void {

    this.destroy$.next(true);

    this.destroy$.complete();

  }

}