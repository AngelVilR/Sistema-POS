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

import { FacturaService } from '../../share/services/factura.service';
import { UtilService } from '../../share/util-service';
import { NotificationService } from '../../share/notification-service';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { FacturaModel } from '../../share/models/FacturaModel';


@Component({
  selector: 'app-venta-detail',
  standalone: false,
  templateUrl: './venta-detail.html',
  styleUrl: './venta-detail.css',
})
export class VentaDetail implements OnInit, OnDestroy {

  datos: FacturaModel | null = null;

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

    console.log(
      'VentaDetail - ngOnInit'
    );


    const idVenta =
      this.route.snapshot.paramMap.get('id');


    console.log(
      'ID de venta recibido:',
      idVenta
    );


    if (
      idVenta !== null &&
      !isNaN(Number(idVenta))
    ) {

      this.getFactura(
        Number(idVenta)
      );

    } else {

      console.error(
        'No se recibió un ID de venta válido'
      );


      this.noti.error(
        'Error',
        'La venta seleccionada no es válida',
        4000
      );

    }

  }


  // ============================================================
  // DESPUÉS DE CREAR LA VISTA
  // ============================================================

  ngAfterViewInit(): void {

    console.log(
      'VentaDetail - ngAfterViewInit'
    );


    /*
     * Forzamos la detección de cambios después
     * de que Angular cree la vista.
     */

    this.cdr.detectChanges();

  }


  // ============================================================
  // OBTENER FACTURA
  // ============================================================

  private getFactura(prId: number): void {

    console.log(
      'Consultando factura:',
      prId
    );


    this.serviceFactura
      .getById(prId)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data: FacturaModel) => {

          console.log(
            'Factura recibida:',
            data
          );


          if (!data) {

            this.datos = null;

            this.cdr.detectChanges();

            return;

          }


          // ====================================================
          // FORMATEAR FECHA
          // ====================================================

          if (data.fecha) {

            data.fechaString =
              this.utilsService.FormatearFechas(
                data.fecha
              );

          }


          // ====================================================
          // FORMATEAR MÉTODO DE PAGO
          // ====================================================

          if (data.metodo_pago) {

            data.metodo_pago =
              this.utilsService.MetodoPagoToString(
                data.metodo_pago
              );

          }


          // ====================================================
          // ASIGNAR DATOS
          // ====================================================

          this.datos = data;


          console.log(
            'Datos asignados a la vista:',
            this.datos
          );


          // ====================================================
          // FORZAR ACTUALIZACIÓN DE ANGULAR
          // ====================================================

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al obtener la factura:',
            error
          );


          this.datos = null;


          this.noti.error(
            'Error',
            'No se pudo cargar el detalle de la venta',
            4000
          );


          this.cdr.detectChanges();

        }

      });

  }


  // ============================================================
  // DESTRUIR COMPONENTE
  // ============================================================

  ngOnDestroy(): void {

    this.destroy$.next(true);

    this.destroy$.complete();

  }

}