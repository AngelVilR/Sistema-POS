import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProductoModel } from '../../share/models/ProductoModel';
import { ProductoService } from '../../share/services/producto.service';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../share/util-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-producto-form',
  standalone: false,
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm {
  destroy$: Subject<boolean> = new Subject<boolean>();

  productoForm!: FormGroup;
  isEditing = false;

  private readonly dialogService = inject(MatDialog);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProductoModel | null,
    private fb: FormBuilder,
    private pService: ProductoService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService
  ) {
    this.initForm();
    this.data == null
      ? this.crearProducto()
      : this.actualizarProducto(this.data);
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      precio: [null, [Validators.required, Validators.min(1)]],
      stock: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
    });
  }

  crearProducto(): void {
    this.isEditing = false;
    this.data = null;
    this.productoForm.reset({ nombre: '', precio: null, stock: null });
  }

  actualizarProducto(producto: any): void {
    this.isEditing = true;
    this.data = producto;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
    });
  }

  guardarProducto(): void {
    this.productoForm.markAllAsTouched();
    if (this.productoForm.invalid) {
      this.noti.error('Error', 'Verifique los campos marcados en rojo', 5000);
      return;
    }

    const formValue = this.productoForm.value;

    if (this.isEditing && this.data) {
      const productoActualizado = new ProductoModel({
        id: this.data.id,
        nombre: formValue.nombre,
        precio: formValue.precio,
        stock: formValue.stock,
        estado: this.data.estado,
      });

      this.pService
        .update(productoActualizado)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.noti.success('Éxito', 'Producto actualizado correctamente');
            this.cancelarEdicion();
            this.dialogService.closeAll();
          },
          error: () => {
            this.noti.error('Error', 'Error al actualizar el producto');
          }
        });
    } else {
      const nuevoProducto = new ProductoModel({
        nombre: formValue.nombre,
        precio: formValue.precio,
        stock: formValue.stock,
        estado: true,
      });

      this.pService.create(nuevoProducto).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.noti.success('Éxito', 'Producto creado correctamente');
          this.cancelarEdicion();
          this.dialogService.closeAll();
        },
        error: () => {
          this.noti.error('Error', 'Error al crear el producto');
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.data = null;
    this.productoForm.reset({ nombre: '', precio: null, stock: null });
    this.dialogService.closeAll();
  }

  errorHandling(controlName: string): string | false {
    const control = this.productoForm.get(controlName);
    if (!control || !control.invalid || (!control.dirty && !control.touched)) {
      return false;
    }
    if (control.errors?.['required']) return 'Este campo es requerido';
    if (control.errors?.['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors?.['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors?.['min']) return `El valor mínimo es ${control.errors['min'].min}`;
    if (control.errors?.['pattern']) return 'Formato inválido';
    return false;
  }

}
