import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProductoService } from '../../share/services/producto.service';
import { NotificationService } from '../../share/notification-service';
import { ProductoModel } from '../../share/models/ProductoModel';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductoForm } from '../producto-form/producto-form';


import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-producto-admin',
  standalone: false,
  templateUrl: './producto-admin.html',
  styleUrl: './producto-admin.css',
})
export class ProductoAdmin implements OnInit, OnDestroy {

  data: ProductoModel[] = [];
  dataLength = 0;

  private destroy$ = new Subject<void>();

  private dialogForm = inject(MatDialog);

  constructor(
    
  private cdr: ChangeDetectorRef,
    private pService: ProductoService,
    private noti: NotificationService,
  ) {}

  ngOnInit(): void {
    this.listProductos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga nuevamente todos los productos.
   */
 private listProductos(): void {
  console.log('Cargando productos...');

  this.pService
    .get()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: ProductoModel[]) => {

        console.log('Productos recibidos:', data);

        this.data = data ?? [];
        this.dataLength = this.data.length;

        console.log('data:', this.data);
        console.log('dataLength:', this.dataLength);

        // Forzar a Angular a actualizar la vista
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Error al cargar productos:', error);

        this.noti.error(
          'Error',
          'Error al cargar los productos'
        );

        // También forzamos la actualización
        this.cdr.detectChanges();
      }
    });
}

  /**
   * Desactiva un producto.
   */
  eliminarProducto(producto: ProductoModel): void {

    const confirmacion = confirm(
      `¿Está seguro de desactivar el producto "${producto.nombre}"?`
    );

    if (!confirmacion) {
      return;
    }

    const productoActualizado = new ProductoModel({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      estado: false,
    });

    this.pService
      .update(productoActualizado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.noti.success(
            'Éxito',
            'Producto desactivado correctamente'
          );

          // Actualiza automáticamente la tabla
          this.listProductos();
             this.cdr.detectChanges();
        },
        error: () => {
          this.noti.error(
            'Error',
            'Error al desactivar el producto'
          );
        }
      });
  }

  /**
   * Activa un producto.
   */
  activarProducto(producto: ProductoModel): void {

    const confirmacion = confirm(
      `¿Está seguro de activar el producto "${producto.nombre}"?`
    );

    if (!confirmacion) {
      return;
    }

    const productoActualizado = new ProductoModel({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      estado: true,
    });

    this.pService
      .update(productoActualizado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.noti.success(
            'Éxito',
            'Producto activado correctamente'
          );

          // Actualiza automáticamente la tabla
          this.listProductos();
             this.cdr.detectChanges();
        },
        error: () => {
          this.noti.error(
            'Error',
            'Error al activar el producto'
          );
        }
      });
  }

  /**
   * Abre el formulario para crear un producto.
   */
  openDialogCreateProducto(): void {

  const dialogRef = this.dialogForm.open(ProductoForm, {
    width: '600px',
    maxWidth: '95vw',
    disableClose: true
  });

  dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {

      console.log('Resultado crear:', result);

      if (result?.success) {

        this.listProductos();

        // Forzar actualización visual
        this.cdr.detectChanges();
      }

    });
}
  /**
   * Abre el formulario para editar un producto.
   */
  openDialogUpdateProducto(producto: ProductoModel): void {

  const dialogRef = this.dialogForm.open(ProductoForm, {
    width: '600px',
    maxWidth: '95vw',
    disableClose: true,
    data: producto
  });

  dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {

      console.log('Resultado actualizar:', result);

      if (result?.success) {

        this.listProductos();

        // Forzar actualización visual
        this.cdr.detectChanges();
      }

    });
}
}