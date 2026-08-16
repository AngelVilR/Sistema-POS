import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { EventoService } from '../../share/services/evento.service';
import { NotificationService } from '../../share/notification-service';
import { EventoModel } from '../../share/models/EventoModel';
import { UtilService } from '../../share/util-service';

import { EventoForm } from '../evento-form/evento-form';

@Component({
  selector: 'app-evento-admin',
  standalone: false,
  templateUrl: './evento-admin.html',
  styleUrl: './evento-admin.css',
})
export class EventoAdmin {

  data: EventoModel[] = [];
  dataLength = 0;

  destroy$: Subject<boolean> = new Subject<boolean>();

  private readonly dialogForm = inject(MatDialog);

  constructor(
    private eService: EventoService,
    private noti: NotificationService,
    private util: UtilService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listEventos();
  }

  /**
   * Carga todos los eventos
   */
  private listEventos(): void {

    this.eService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (data: EventoModel[]) => {

          data.forEach((evento: EventoModel) => {

            evento.formatoFechaInicio =
              this.util.FormatearFechas(evento.fechaInicio);

            evento.formatoFechaFin =
              this.util.FormatearFechas(evento.fechaFin);

          });

          this.data = data;
          this.dataLength = data.length;

          /*
           * Forzamos a Angular a actualizar la vista.
           */
          this.cdr.detectChanges();

          console.log('Eventos cargados:', this.data);

        },

        error: (error) => {

          console.error('Error al cargar eventos:', error);

          this.noti.error(
            'Error',
            'Error al cargar los eventos'
          );

          this.data = [];
          this.dataLength = 0;

          this.cdr.detectChanges();
        }

      });
  }

  /**
   * Crear evento
   */
  openDialogCreateEvento(): void {

    const dialogRef = this.dialogForm.open(EventoForm, {
      width: '600px',
      maxWidth: '95vw',
      autoFocus: false
    });

    /*
     * Cuando el formulario se cierre:
     *
     * true = se creó/actualizó un evento
     * false/undefined = simplemente se canceló
     */
    dialogRef.afterClosed().subscribe((resultado) => {

      console.log('Resultado diálogo crear:', resultado);

      if (resultado === true) {

        this.listEventos();

        /*
         * Forzamos nuevamente la detección
         * para asegurarnos de que la lista se pinte.
         */
        this.cdr.detectChanges();
      }

    });
  }

  /**
   * Actualizar evento
   */
  openDialogUpdateEvento(evento: EventoModel): void {

    const dialogRef = this.dialogForm.open(EventoForm, {
      data: evento,
      width: '600px',
      maxWidth: '95vw',
      autoFocus: false
    });

    /*
     * Esperamos a que termine el formulario.
     */
    dialogRef.afterClosed().subscribe((resultado) => {

      console.log('Resultado diálogo actualizar:', resultado);

      if (resultado === true) {

        this.listEventos();

        this.cdr.detectChanges();
      }

    });
  }

  ngOnDestroy(): void {

    this.destroy$.next(true);
    this.destroy$.complete();

  }
}