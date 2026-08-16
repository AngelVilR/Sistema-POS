import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProductoModel } from '../../share/models/ProductoModel';
import { ProductoService } from '../../share/services/producto.service';
import { NotificationService } from '../../share/notification-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-producto-form',
  standalone: false,
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnDestroy {

  destroy$ = new Subject<void>();

  productoForm!: FormGroup;

  isEditing = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ProductoModel | null,

    private fb: FormBuilder,

    private pService: ProductoService,

    private noti: NotificationService,

    private dialogRef: MatDialogRef<ProductoForm>
  ) {

    this.initForm();

    if (this.data) {
      this.actualizarProducto(this.data);
    } else {
      this.crearProducto();
    }
  }

  /**
   * Inicializa el formulario.
   */
  private initForm(): void {

    this.productoForm = this.fb.group({

      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      precio: [
        null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      stock: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]+$')
        ]
      ]

    });
  }

  /**
   * Configura el formulario para crear.
   */
  private crearProducto(): void {

    this.isEditing = false;

    this.productoForm.reset({
      nombre: '',
      precio: null,
      stock: null
    });
  }

  /**
   * Configura el formulario para editar.
   */
  private actualizarProducto(producto: ProductoModel): void {

    this.isEditing = true;

    this.productoForm.patchValue({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock
    });
  }

  /**
   * Guarda o actualiza el producto.
   */
  guardarProducto(): void {

    this.productoForm.markAllAsTouched();

    if (this.productoForm.invalid) {

      this.noti.error(
        'Error',
        'Verifique los campos marcados en rojo',
        5000
      );

      return;
    }

    const formValue = this.productoForm.value;

    /*
     * ACTUALIZAR
     */
    if (this.isEditing && this.data) {

      const productoActualizado = new ProductoModel({

        id: this.data.id,

        nombre: formValue.nombre,

        precio: formValue.precio,

        stock: formValue.stock,

        estado: this.data.estado

      });

      this.pService
        .update(productoActualizado)
        .pipe(takeUntil(this.destroy$))
        .subscribe({

          next: () => {

            this.noti.success(
              'Éxito',
              'Producto actualizado correctamente'
            );

            /*
             * Le informamos al componente padre que
             * la operación fue exitosa.
             */
            this.dialogRef.close({
              success: true,
              action: 'update'
            });
          },

          error: () => {

            this.noti.error(
              'Error',
              'Error al actualizar el producto'
            );

          }

        });

      return;
    }

    /*
     * CREAR
     */
    const nuevoProducto = new ProductoModel({

      nombre: formValue.nombre,

      precio: formValue.precio,

      stock: formValue.stock,

      estado: true

    });

    this.pService
      .create(nuevoProducto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: () => {

          this.noti.success(
            'Éxito',
            'Producto creado correctamente'
          );

          /*
           * Le informamos al componente padre que
           * la operación fue exitosa.
           */
          this.dialogRef.close({
            success: true,
            action: 'create'
          });
        },

        error: () => {

          this.noti.error(
            'Error',
            'Error al crear el producto'
          );

        }

      });
  }

  /**
   * Cancela la edición y cierra solamente este diálogo.
   */
  cancelarEdicion(): void {

    this.dialogRef.close({
      success: false,
      action: 'cancel'
    });
  }

  /**
   * Manejo de errores de los controles.
   */
  errorHandling(controlName: string): string | false {

    const control = this.productoForm.get(controlName);

    if (
      !control ||
      !control.invalid ||
      (!control.dirty && !control.touched)
    ) {
      return false;
    }

    if (control.errors?.['required']) {
      return 'Este campo es requerido';
    }

    if (control.errors?.['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }

    if (control.errors?.['maxlength']) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }

    if (control.errors?.['min']) {
      return `El valor mínimo es ${control.errors['min'].min}`;
    }

    if (control.errors?.['pattern']) {
      return 'Formato inválido';
    }

    return false;
  }

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }
}