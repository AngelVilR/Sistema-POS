import {
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  ProductoModel
} from '../../share/models/ProductoModel';

import {
  EventoModel
} from '../../share/models/EventoModel';

import {
  UsuarioModel
} from '../../share/models/UsuarioModel';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  ProductoService
} from '../../share/services/producto.service';

import {
  EventoService
} from '../../share/services/evento.service';

import {
  UsuarioService
} from '../../share/services/usuario.service';

import {
  NotificationService
} from '../../share/notification-service';

import {
  VentaModel
} from '../../share/models/VentaModel';

import {
  getFormValidationErrorMessage
} from '../../share/form-validation';

import {
  VentaService
} from '../../share/services/venta.service';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';


@Component({
  selector: 'app-venta-asignar-form',
  standalone: false,
  templateUrl: './venta-asignar-form.html',
  styleUrl: './venta-asignar-form.css',
})
export class VentaAsignarForm implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  asignarForm!: FormGroup;

  /*
   * true  = crear
   * false = actualizar
   */
  isCreate: boolean = true;

  listProductos: ProductoModel[] = [];
  listEventos: EventoModel[] = [];
  listUsuarios: UsuarioModel[] = [];

  patternStock = /^[1-9]\d*$/;


  constructor(

    @Inject(MAT_DIALOG_DATA)
    public data: VentaModel | null,

    private fb: FormBuilder,

    private productoService: ProductoService,

    private eventoService: EventoService,

    private usuarioService: UsuarioService,

    private ventaService: VentaService,

    private noti: NotificationService,

    private dialogRef: MatDialogRef<VentaAsignarForm>

  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    /*
     * Inicializar formulario
     */
    this.initForm();


    /*
     * Cargar listas de los selects
     */
    this.getListProductos();

    this.getListEventos();

    this.getListUsuarios();


    /*
     * Si recibimos data desde el administrador,
     * estamos actualizando.
     */
    if (this.data != null) {

      this.isCreate = false;

      this.cargarAsignacion();

    } else {

      /*
       * Si no recibimos data,
       * estamos creando.
       */
      this.isCreate = true;
    }
  }


  // =========================================================
  // FORMULARIO
  // =========================================================

  private initForm(): void {

    this.asignarForm = this.fb.group({

      productoId: [
        null,
        [
          Validators.required
        ]
      ],

      eventoId: [
        null,
        [
          Validators.required
        ]
      ],

      usuarioId: [
        null,
        [
          Validators.required
        ]
      ],

      cantidad: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(this.patternStock)
        ]
      ]

    });

  }


  // =========================================================
  // CARGAR ASIGNACIÓN PARA EDITAR
  // =========================================================

  private cargarAsignacion(): void {

    if (!this.data) {
      return;
    }

    console.log(
      'Cargando asignación:',
      this.data
    );


    this.ventaService
      .getByIdVenta(
        this.data.eventoId,
        this.data.usuarioId,
        this.data.productoId
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (venta: VentaModel) => {

          console.log(
            'Asignación recibida:',
            venta
          );


          this.asignarForm.patchValue({

            productoId: venta.productoId,

            eventoId: venta.eventoId,

            usuarioId: venta.usuarioId,

            cantidad: venta.cantidad

          });

        },

        error: (error) => {

          console.error(
            'Error al cargar la asignación:',
            error
          );

          this.noti.error(
            'Error',
            'No se pudo cargar la asignación',
            4000
          );

        }

      });

  }


  // =========================================================
  // PRODUCTOS
  // =========================================================

  getListProductos(): void {

    this.productoService
      .get()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data: ProductoModel[]) => {

          this.listProductos = data ?? [];

          console.log(
            'Productos:',
            this.listProductos
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar productos:',
            error
          );

          this.noti.error(
            'Error',
            'No se pudieron cargar los productos',
            4000
          );

        }

      });

  }


  // =========================================================
  // EVENTOS
  // =========================================================

  getListEventos(): void {

    this.eventoService
      .get()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data: EventoModel[]) => {

          this.listEventos = data ?? [];

          console.log(
            'Eventos:',
            this.listEventos
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar eventos:',
            error
          );

          this.noti.error(
            'Error',
            'No se pudieron cargar los eventos',
            4000
          );

        }

      });

  }


  // =========================================================
  // USUARIOS
  // =========================================================

  getListUsuarios(): void {

    this.usuarioService
      .get()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data: UsuarioModel[]) => {

          /*
           * Solo colaboradores.
           * Se excluyen administradores.
           */
          this.listUsuarios = (data ?? []).filter(
            (usuario: UsuarioModel) =>
              usuario.role !== 'ADMIN'
          );

          console.log(
            'Usuarios:',
            this.listUsuarios
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar usuarios:',
            error
          );

          this.noti.error(
            'Error',
            'No se pudieron cargar los usuarios',
            4000
          );

        }

      });

  }


  // =========================================================
  // SUBMIT
  // =========================================================

  submitAsignar(): void {

    /*
     * Mostrar errores de todos los campos.
     */
    this.asignarForm.markAllAsTouched();


    /*
     * Validar formulario.
     */
    if (this.asignarForm.invalid) {

      this.noti.error(
        'Formulario inválido',
        'Faltan datos pendientes para continuar',
        4000
      );

      return;
    }


    /*
     * getRawValue() permite obtener también
     * los valores de controles disabled.
     *
     * Esto es importante cuando estamos actualizando,
     * porque usuario/evento/producto están deshabilitados.
     */
    const formValue =
      this.asignarForm.getRawValue();


    const productoId =
      Number(formValue.productoId);

    const eventoId =
      Number(formValue.eventoId);

    const usuarioId =
      Number(formValue.usuarioId);

    const cantidad =
      Number(formValue.cantidad);


    console.log(
      '========== FORMULARIO =========='
    );

    console.log(
      'Producto:',
      productoId
    );

    console.log(
      'Evento:',
      eventoId
    );

    console.log(
      'Usuario:',
      usuarioId
    );

    console.log(
      'Cantidad:',
      cantidad
    );


    /*
     * Primero obtenemos el producto para comprobar
     * el stock real.
     */
    this.productoService
      .getById(productoId)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (producto: ProductoModel) => {

          console.log(
            'Producto obtenido:',
            producto
          );

          console.log(
            'Stock disponible:',
            producto.stock
          );

          console.log(
            'Cantidad solicitada:',
            cantidad
          );


          /*
           * Comprobar stock.
           */
          if (cantidad > producto.stock) {

            this.noti.error(
              'Stock insuficiente',
              'La cantidad sobrepasa el stock disponible',
              4000
            );

            return;
          }


          /*
           * Construir objeto de asignación.
           */
          const asignacion: VentaModel = {

            eventoId: eventoId,

            usuarioId: usuarioId,

            productoId: productoId,

            cantidad: cantidad

          } as VentaModel;


          console.log(
            'Asignación a guardar:',
            asignacion
          );


          /*
           * Guardar.
           *
           * Dependiendo de isCreate:
           *
           * true  -> create
           * false -> updateVenta
           */
          this.guardarAsignar(
            asignacion
          );

        },

        error: (error) => {

          console.error(
            'Error al consultar el producto:',
            error
          );

          this.noti.error(
            'Error',
            'No se pudo verificar el stock del producto',
            4000
          );

        }

      });

  }


  // =========================================================
  // CREAR / ACTUALIZAR
  // =========================================================

  private guardarAsignar(
    asignacion: VentaModel
  ): void {


    // =======================================================
    // CREAR
    // =======================================================

    if (this.isCreate) {

      console.log(
        'CREANDO ASIGNACIÓN'
      );


      this.ventaService
        .create(asignacion)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe({

          next: (data: VentaModel) => {

            console.log(
              'Asignación creada:',
              data
            );


            this.noti.success(
              'Asignación completada',
              'La asignación se creó correctamente',
              4000
            );


            /*
             * Cerramos únicamente este diálogo.
             *
             * Enviamos success=true al componente padre.
             */
            this.dialogRef.close({

              success: true,

              action: 'create'

            });

          },

          error: (error) => {

            console.error(
              'Error al crear asignación:',
              error
            );

            this.noti.error(
              'Error',
              'No se pudo crear la asignación',
              4000
            );

          }

        });


      return;
    }


    // =======================================================
    // ACTUALIZAR
    // =======================================================

    console.log(
      'ACTUALIZANDO ASIGNACIÓN'
    );


    this.ventaService
      .updateVenta(

        asignacion,

        asignacion.eventoId,

        asignacion.usuarioId,

        asignacion.productoId

      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data: VentaModel) => {

          console.log(
            'Asignación actualizada:',
            data
          );


          this.noti.success(
            'Asignación actualizada',
            'La asignación fue actualizada correctamente',
            4000
          );


          /*
           * Avisar al componente padre
           * que debe volver a cargar la lista.
           */
          this.dialogRef.close({

            success: true,

            action: 'update'

          });

        },

        error: (error) => {

          console.error(
            'Error al actualizar asignación:',
            error
          );

          this.noti.error(
            'Error',
            'No se pudo actualizar la asignación',
            4000
          );

        }

      });

  }


  // =========================================================
  // VALIDACIONES
  // =========================================================

  public errorHandling(
    controlPath: string
  ): string | false {

    return getFormValidationErrorMessage(
      this.asignarForm,
      controlPath
    );

  }


  // =========================================================
  // CANCELAR
  // =========================================================

  onReset(): void {

    /*
     * No necesitamos resetear manualmente
     * el formulario porque vamos a cerrar el diálogo.
     */

    this.dialogRef.close({

      success: false,

      action: 'cancel'

    });

  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}