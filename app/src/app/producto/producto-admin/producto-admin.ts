import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from '../../share/services/producto.service';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoModel } from '../../share/models/ProductoModel';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-producto-admin',
  standalone: false,
  templateUrl: './producto-admin.html',
  styleUrl: './producto-admin.css',
})
export class ProductoAdmin {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<ProductoModel>();

  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['nombre', 'precio', 'stock', 'estado', 'acciones'];

  productoForm!: FormGroup;
  isEditing = false;
  selectedProducto: ProductoModel | null = null;

  constructor(
    private fb: FormBuilder,
    private pService: ProductoService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Items';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Inicio';
    this.paginator._intl.lastPageLabel = 'Fin';
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.listProductos();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
    });
  }

  private listProductos(): void {
    this.pService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: () => {
        this.noti.error('Error', 'Error al cargar los productos');
      }
    });
  }

  crearProducto(): void {
    this.isEditing = false;
    this.selectedProducto = null;
    this.productoForm.reset({ nombre: '', precio: null, stock: null });
  }

  actualizarProducto(producto: ProductoModel): void {
    this.isEditing = true;
    this.selectedProducto = producto;
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

    if (this.isEditing && this.selectedProducto) {
      const productoActualizado = new ProductoModel({
        id: this.selectedProducto.id,
        nombre: formValue.nombre,
        precio: formValue.precio,
        stock: formValue.stock,
        estado: this.selectedProducto.estado,
      });

      this.pService.update(productoActualizado).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.noti.success('Éxito', 'Producto actualizado correctamente');
          this.cancelarEdicion();
          this.listProductos();
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
          this.listProductos();
        },
        error: () => {
          this.noti.error('Error', 'Error al crear el producto');
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.selectedProducto = null;
    this.productoForm.reset({ nombre: '', precio: null, stock: null });
  }

  eliminarProducto(producto: ProductoModel): void {
    const confirmacion = confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?`);
    if (!confirmacion) return;

    this.pService.delete(producto).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.noti.success('Éxito', 'Producto eliminado correctamente');
        this.listProductos();
      },
      error: () => {
        this.noti.error('Error', 'Error al eliminar el producto');
      }
    });
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
