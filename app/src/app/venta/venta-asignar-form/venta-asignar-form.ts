import { Component, inject, Inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductoModel } from '../../share/models/ProductoModel';
import { EventoModel } from '../../share/models/EventoModel';
import { UsuarioModel } from '../../share/models/UsuarioModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductoService } from '../../share/services/producto.service';
import { EventoService } from '../../share/services/evento.service';
import { UsuarioService } from '../../share/services/usuario.service';
import { NotificationService } from '../../share/notification-service';
import { VentaModel } from '../../share/models/VentaModel';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { VentaService } from '../../share/services/venta.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-venta-asignar-form',
  standalone: false,
  templateUrl: './venta-asignar-form.html',
  styleUrl: './venta-asignar-form.css',
})
export class VentaAsignarForm {
  private destroy$ = new Subject<boolean>();
  titleForm: string = "Crear"
  isCreate: boolean = false

  idProducto: number | null = null
  idEvento: number | null = null
  idUsuario: number | null = null

  listProductos: ProductoModel[] = []
  listEventos: EventoModel[] = []
  listUsuarios: UsuarioModel[] = []

  asignarForm!: FormGroup

  private readonly dialogService = inject(MatDialog);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: VentaModel | null,
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private productoService: ProductoService,
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private ventaService: VentaService,
    private noti: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getListEventos();
    this.getListProductos();
    this.getListUsuarios();
    if (this.data != null) {
      this.ventaService
        .getByIdVenta(this.data.eventoId, this.data.usuarioId, this.data.productoId)
        .subscribe((data: VentaModel) => {
          this.isCreate = true
          this.patchFormValues(data);
        })
    }
  }

  patternStock = /^[1-9]\d*$/;

  private initForm(): void {
    this.asignarForm = this.fb.group({
      productoId: [null, [Validators.required]],
      eventoId: [null, [Validators.required]],
      usuarioId: [null, [Validators.required]],
      cantidad: [null, [Validators.required, Validators.min(1), Validators.pattern(this.patternStock)]],
    })
  }

  getListProductos() {
    this.productoService
      .get()
      .subscribe((data: ProductoModel[]) => {
        this.listProductos = data
      })
  }

  getListEventos() {
    this.eventoService
      .get()
      .subscribe((data: EventoModel[]) => {
        this.listEventos = data
      })
  }

  getListUsuarios() {
    this.usuarioService
      .get()
      .subscribe((data: UsuarioModel[]) => {
        data = data.filter((x: UsuarioModel) => x.role != 'ADMIN')
        this.listUsuarios = data
      })
  }

  private patchFormValues(data: VentaModel): void {
    this.asignarForm.patchValue({
      productoId: data.productoId,
      eventoId: data.eventoId,
      usuarioId: data.usuarioId,
      cantidad: data.cantidad,
    })
  }

  submitAsignar(): void {
    this.asignarForm.markAllAsTouched();
    if (this.asignarForm.invalid) {
      this.noti.error("Error", "Falta datos pendientes para continuar", 4000)
      return
    }

    const formValue = this.asignarForm.value;
    console.log("---FORMULARIO---", formValue)

    if (!this.validStockMax(formValue.productoId, Number(formValue.cantidad))) {
      this.noti.error("Error", "La cantidad sobrepasa el stock disponible", 4000)
      return
    }

    const objAsignar: VentaModel = {
      eventoId: formValue.eventoId,
      productoId: formValue.productoId,
      usuarioId: formValue.usuarioId,
      cantidad: Number(formValue.cantidad)
    } as VentaModel

    this.guardarAsignar(objAsignar);
  }

  guardarAsignar(prAsignar: VentaModel) {
    if (!this.isCreate) {
      this.ventaService
        .create(prAsignar)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: VentaModel) => {
          this.noti.success("Asignación completada", "La asignación se creo correctamente", 4000)
          this.onReset()
          this.dialogService.closeAll();
        })
    } else {
      this.ventaService
        .updateVenta(prAsignar, prAsignar.eventoId, prAsignar.usuarioId, prAsignar.productoId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: VentaModel) => {
          this.noti.success("Asignación actualizada", "La asignación fue actualizada correctamente", 4000)
          this.onReset()
          this.dialogService.closeAll();
        })
    }
  }

  private validStockMax(prIdProd: number, prCant: number): boolean {
    let valid = false
    this.productoService
      .getById(prIdProd)
      .subscribe((data: ProductoModel) => {
        if (prCant <= data.stock) {
          valid = true;
        }
      })
    return valid;
  }

  public errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.asignarForm, controlPath);
  }

  onReset(): void {
    this.isCreate = false;
    this.data = null;
    this.asignarForm.reset();
    this.dialogService.closeAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
