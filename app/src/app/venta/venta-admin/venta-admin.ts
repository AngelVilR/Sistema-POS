import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject,
  takeUntil
} from 'rxjs';

import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';

import { FacturaService } from '../../share/services/factura.service';
import { FacturaModel } from '../../share/models/FacturaModel';

import { UtilService } from '../../share/util-service';


@Component({
  selector: 'app-venta-admin',
  standalone: false,
  templateUrl: './venta-admin.html',
  styleUrl: './venta-admin.css',
})
export class VentaAdmin implements OnInit, OnDestroy {

  data: FacturaModel[] = [];

  dataLength: number = 0;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(

    private cdr: ChangeDetectorRef,

    private serviceFactura: FacturaService,

    private utilsService: UtilService,

    private noti: NotificationService,

    private router: Router,

    private route: ActivatedRoute

  ) {}


  // ============================================================
  // INICIO
  // ============================================================

  ngOnInit(): void {

    console.log('VentaAdmin - ngOnInit');

    this.listFacturas();

  }


  // ============================================================
  // DESPUÉS DE CREAR LA VISTA
  // ============================================================

  ngAfterViewInit(): void {

    console.log('VentaAdmin - ngAfterViewInit');

    /*
     * Forzamos nuevamente la carga después de que
     * Angular haya creado la vista.
     *
     * Esto es igual al patrón que utilizamos
     * anteriormente en Producto y Usuario.
     */

    this.listFacturas();

  }


  // ============================================================
  // LISTAR FACTURAS / VENTAS
  // ============================================================

  private listFacturas(): void {

    console.log('Cargando lista de ventas...');


    this.serviceFactura
      .get()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (respuesta: FacturaModel[]) => {

          console.log(
            'Ventas recibidas:',
            respuesta
          );


          /*
           * Verificamos que exista una respuesta.
           */

          if (!respuesta) {

            this.data = [];

            this.dataLength = 0;

            this.cdr.detectChanges();

            return;

          }


          /*
           * Formateamos los datos antes de
           * asignarlos a la vista.
           */

          respuesta.forEach((x: FacturaModel) => {

            /*
             * Fecha.
             */

            if (x.fecha) {

              x.fechaString =
                this.utilsService.FormatearFechas(
                  x.fecha
                );

            }


            /*
             * Método de pago.
             */

            if (x.metodo_pago) {

              x.metodo_pago =
                this.utilsService.MetodoPagoToString(
                  x.metodo_pago
                );

            }

          });


          /*
           * Guardamos la información.
           */

          this.data = respuesta;

          this.dataLength = this.data.length;


          console.log(
            'Data asignada:',
            this.data
          );

          console.log(
            'Cantidad de ventas:',
            this.dataLength
          );


          /*
           * FORZAR ACTUALIZACIÓN DE LA VISTA.
           *
           * Esta es la parte importante que
           * estamos utilizando también en Producto
           * y Usuario.
           */

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al cargar las ventas:',
            error
          );


          this.data = [];

          this.dataLength = 0;


          this.noti.error(
            'Error',
            'Error al cargar las ventas',
            4000
          );


          /*
           * Actualizar la vista incluso cuando
           * ocurre un error.
           */

          this.cdr.detectChanges();

        }

      });

  }


  // ============================================================
  // DETALLE DE VENTA
  // ============================================================

  goDetailVenta(prId: number): void {

    console.log(
      'Consultando venta:',
      prId
    );


    this.router.navigate([
      'venta-detail',
      prId
    ]);

  }


  // ============================================================
  // DESTRUIR COMPONENTE
  // ============================================================

  ngOnDestroy(): void {

    this.destroy$.next(true);

    this.destroy$.complete();

  }

}