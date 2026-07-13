import { Component, inject, Signal } from '@angular/core';
import { ProductoService } from '../../share/services/producto.service';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoModel } from '../../share/models/ProductoModel';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductoForm } from '../producto-form/producto-form';

@Component({
  selector: 'app-producto-admin',
  standalone: false,
  templateUrl: './producto-admin.html',
  styleUrl: './producto-admin.css',
})

export class ProductoAdmin {
  data: any;
  dataLength: any

  destroy$: Subject<boolean> = new Subject<boolean>();

  private dialogForm = inject(MatDialog)

  constructor(
    private pService: ProductoService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.listProductos();
  }

  ngAfterViewInit() {
    this.listProductos();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private listProductos(): void {
    this.pService
      .get()
      .subscribe({
        next: (data: ProductoModel[]) => {
          this.data = data
          this.dataLength = this.data.length
        },
        error: () => {
          this.noti.error('Error', 'Error al cargar los productos');
        }
      });
  }

  eliminarProducto(producto: ProductoModel): void {
    const confirmacion = confirm(`¿Está seguro de desactivar el producto "${producto.nombre}"?`);
    if (!confirmacion) return;

    const productoActualizado = new ProductoModel({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      estado: false,
    });

    this.pService
      .update(productoActualizado)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.noti.success('Éxito', 'Producto desactivado correctamente');
          this.listProductos();
        },
        error: () => {
          this.noti.error('Error', 'Error al desactivar el producto');
        }
      });
  }

  activarProducto(producto: ProductoModel): void {
    const confirmacion = confirm(`¿Está seguro de activar el producto "${producto.nombre}"?`);
    if (!confirmacion) return;

    const productoActualizado = new ProductoModel({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      estado: true,
    });

    this.pService
      .update(productoActualizado)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.noti.success('Éxito', 'Producto se activi correctamente');
          this.listProductos();
        },
        error: () => {
          this.noti.error('Error', 'Error al activar el producto');
        }
      });
  }

  openDialogCreateProducto() {
    this.dialogForm.open(ProductoForm)
  }

  openDialogUpdateProducto(prProducto: ProductoModel) {
    this.dialogForm.open(ProductoForm, { data: prProducto })
  }
}
