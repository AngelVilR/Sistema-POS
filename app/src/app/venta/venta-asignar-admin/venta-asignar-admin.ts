import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import {
  Subject,
  takeUntil
} from 'rxjs';

import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../../share/services/venta.service';
import { VentaModel } from '../../share/models/VentaModel';
import { MatDialog } from '@angular/material/dialog';
import { VentaAsignarForm } from '../venta-asignar-form/venta-asignar-form';


@Component({
  selector: 'app-venta-asignar-admin',
  standalone: false,
  templateUrl: './venta-asignar-admin.html',
  styleUrl: './venta-asignar-admin.css',
})
export class VentaAsignarAdmin implements OnInit, OnDestroy {

  data: VentaModel[] = [];
  dataLength: number = 0;

  destroy$: Subject<boolean> = new Subject<boolean>();

  private dialogForm = inject(MatDialog);


  constructor(

    private cdr: ChangeDetectorRef,

    private serviceVenta: VentaService,

    private noti: NotificationService,

    private router: Router,

    private route: ActivatedRoute

  ) {}


  // =========================================================
  // INICIO
  // =========================================================

  ngOnInit(): void {

    console.log('VentaAdmin - ngOnInit');

    this.getListColabs();

  }


  // =========================================================
  // DESPUÉS DE LA VISTA
  // =========================================================

  ngAfterViewInit(): void {

    console.log('VentaAdmin - ngAfterViewInit');

    /*
     * Lo dejamos también aquí para forzar la carga,
     * igual que hicimos con los otros mantenimientos.
     */
    setTimeout(() => {

      this.getListColabs();

    }, 0);

  }


  // =========================================================
  // CARGAR LISTA
  // =========================================================

  getListColabs(): void {

    console.log('================================');
    console.log('CARGANDO LISTA DE VENTAS');
    console.log('================================');


    this.serviceVenta
      .get()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (respuesta: VentaModel[]) => {

          console.log(
            'RESPUESTA DEL SERVICIO VENTA:',
            respuesta
          );


          /*
           * Guardar datos.
           */
          this.data = respuesta ?? [];


          /*
           * Actualizar cantidad.
           */
          this.dataLength = this.data.length;


          console.log(
            'DATA:',
            this.data
          );

          console.log(
            'DATA LENGTH:',
            this.dataLength
          );


          /*
           * Forzar actualización de Angular.
           */
          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'ERROR AL CARGAR VENTAS:',
            error
          );


          this.data = [];

          this.dataLength = 0;


          this.noti.error(
            'Error',
            'Error al cargar las asignaciones',
            4000
          );


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // CREAR
  // =========================================================

  openDialogCreateAsignar(): void {

    console.log(
      'Abriendo formulario de crear asignación'
    );


    const dialogRef =
      this.dialogForm.open(
        VentaAsignarForm,
        {
          width: '650px',
          maxWidth: '95vw',
          disableClose: true
        }
      );


    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((resultado) => {

        console.log(
          'Formulario crear cerrado:',
          resultado
        );


        /*
         * Si el formulario guardó correctamente,
         * volvemos a consultar la lista.
         */
        if (resultado?.success) {

          console.log(
            'Recargando lista después de crear...'
          );


          this.getListColabs();


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // ACTUALIZAR
  // =========================================================

  openDialogUpdateAsignar(
    prItem: VentaModel
  ): void {

    console.log(
      'Abriendo formulario de actualizar:',
      prItem
    );


    const dialogRef =
      this.dialogForm.open(
        VentaAsignarForm,
        {
          width: '650px',
          maxWidth: '95vw',
          disableClose: true,
          data: prItem
        }
      );


    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((resultado) => {

        console.log(
          'Formulario actualizar cerrado:',
          resultado
        );


        /*
         * Si se actualizó correctamente,
         * volver a consultar.
         */
        if (resultado?.success) {

          console.log(
            'Recargando lista después de actualizar...'
          );


          this.getListColabs();


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // CREAR POR RUTA
  // =========================================================

  goAsignarCreate(): void {

    this.router.navigate(
      ['/asignar-producto/create'],
      {
        relativeTo: this.route
      }
    );

  }


  // =========================================================
  // ACTUALIZAR POR RUTA
  // =========================================================

  goAsignarUpdate(
    prItem: VentaModel
  ): void {

    this.router.navigate([
      'asignar-producto/update',
      prItem.eventoId,
      prItem.usuarioId,
      prItem.productoId
    ]);

  }


  // =========================================================
  // DESTRUIR
  // =========================================================

  ngOnDestroy(): void {

    this.destroy$.next(true);

    this.destroy$.complete();

  }

}