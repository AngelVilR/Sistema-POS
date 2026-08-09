import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UsuarioService } from '../../share/services/usuario.service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { NotificationService } from '../../share/notification-service';
import { emailExistsValidator } from '../../share/Validators/email-exists.validator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UsuarioModel } from '../../share/models/UsuarioModel';

@Component({
  selector: 'app-usuario-form',
  standalone: false,
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm {
  datos: any;
  userCreate!: FormGroup<any>;
  makeSubmit: boolean = false;
  infoUsuario: any;
  idUsuario: number | null = null;
  isCreate: boolean = true;
  originalEmail: string = '';
  usuarioOriginal: any = null;
  private destroy$ = new Subject<boolean>();

  private readonly dialogService = inject(MatDialog);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UsuarioModel | null,
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private noti: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.data != null) {
      const passwordControl = this.userCreate.get('password');
      this.isCreate = false
      passwordControl?.clearValidators();
      passwordControl?.clearAsyncValidators();
      passwordControl?.updateValueAndValidity();
      this.cargarUsuario(this.data.id);
    }
  }

  private initForm(): void {
    this.userCreate = this.fb.group({
      id: [null],
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      email: [null, {
        validators: [Validators.required, Validators.email],
        asyncValidators: [emailExistsValidator(this.usuarioService,
          () => this.originalEmail
        ),
        ],
        updateOn: 'change'
      }],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6),
      Validators.pattern(/^\d+$/)
      ]],
      telefono: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8),
      Validators.pattern(/^\d+$/)
      ]]
    })
  }

  onReset() {
    if (this.isCreate) {
      this.userCreate.reset();
      return;
    }
    this.resetUsuario(this.usuarioOriginal);
    this.userCreate.markAsPristine();
    this.userCreate.markAsUntouched();
    this.dialogService.closeAll();
  }

  private resetUsuario(usuario: any) {
    this.userCreate.patchValue({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono
    });
  }

  cargarUsuario(id: number) {
    this.usuarioService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {

        this.usuarioOriginal = { ...usuario };
        this.originalEmail = usuario.email;

        this.userCreate.patchValue({
          nombre: usuario.nombre,
          email: usuario.email,
          id: usuario.id,
          telefono: usuario.telefono
        });
      });
  }

  submitForm() {
    this.userCreate.markAllAsTouched();
    console.log('Formulario válido:', this.userCreate.valid);
    console.log('Errores formulario:', this.userCreate.errors);
    console.log('Valores:', this.userCreate.value);

    Object.keys(this.userCreate.controls).forEach(key => {
      const control = this.userCreate.get(key);
      console.log(
        key,
        'valid:',
        control?.valid,
        'errors:',
        control?.errors
      );
    });

    this.makeSubmit = true;
    //Validación
    if (this.userCreate.invalid) {
      this.noti.error(
        'Formulario Invalido',
        'Por favor revise los campos marcados en rojo',
        3000
      );
      return;
    }
    if (this.isCreate) {
      this.guardarUsuario();
    } else {
      this.actualizarUsuario();
    }

  }

  actualizarUsuario() {
    const value = this.userCreate.value;

    if (!this.isCreate) {
      delete value.password; // Eliminar el campo password si no se está creando un usuario
    }

    console.log('Payload Update:', value);
    value.telefono = value.telefono
      ? Number(value.telefono)
      : null;

    this.usuarioService
      .update(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {

        this.noti.success(
          'Éxito',
          'Usuario actualizado exitosamente',
          3000,
        );
        this.dialogService.closeAll();
      });
  }

  guardarUsuario() {
    const value = this.userCreate.value;
    value.telefono = value.telefono ? Number(value.telefono) : null;

    this.usuarioService
      .create(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.noti.success(
          'Éxito', 'Usuario creado exitosamente',
          3000,
        )
        this.dialogService.closeAll();
      });
  }

  public errorHandling(controlPath: string): string | false {
    // Pasamos el formulario principal y la ruta del control
    return getFormValidationErrorMessage(this.userCreate, controlPath);
  }
}
