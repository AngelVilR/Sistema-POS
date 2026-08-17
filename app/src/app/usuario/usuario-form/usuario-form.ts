import {
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  UsuarioService
} from '../../share/services/usuario.service';

import {
  getFormValidationErrorMessage
} from '../../share/form-validation';

import {
  NotificationService
} from '../../share/notification-service';

import {
  emailExistsValidator
} from '../../share/Validators/email-exists.validator';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  UsuarioModel
} from '../../share/models/UsuarioModel';

@Component({
  selector: 'app-usuario-form',
  standalone: false,
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm
  implements OnInit, OnDestroy {

  datos: any;

  userCreate!: FormGroup<any>;

  makeSubmit = false;

  infoUsuario: any;

  idUsuario: number | null = null;

  isCreate = true;

  originalEmail = '';

  usuarioOriginal: any = null;

  private destroy$ = new Subject<void>();

  constructor(

    @Inject(MAT_DIALOG_DATA)
    public data: UsuarioModel | null,

    public fb: FormBuilder,

    private usuarioService: UsuarioService,

    private noti: NotificationService,

    private dialogRef: MatDialogRef<UsuarioForm>

  ) {}

  ngOnInit(): void {

    this.initForm();

    /*
     * Si recibimos data significa que estamos editando.
     */
    if (this.data != null) {

      const passwordControl =
        this.userCreate.get('password');

      this.isCreate = false;

      /*
       * En edición no necesitamos contraseña.
       */
      passwordControl?.clearValidators();

      passwordControl?.clearAsyncValidators();

      passwordControl?.updateValueAndValidity();

      /*
       * Cargamos los datos completos del usuario.
       */
      this.cargarUsuario(this.data.id);
    }
  }

  /**
   * Inicializar formulario
   */
  private initForm(): void {

    this.userCreate = this.fb.group({

      id: [null],

      nombre: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25)
        ]
      ],

      email: [
        null,
        {
          validators: [
            Validators.required,
            Validators.email
          ],

          asyncValidators: [
            emailExistsValidator(
              this.usuarioService,
              () => this.originalEmail
            )
          ],

          updateOn: 'change'
        }
      ],

      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^\d+$/)
        ]
      ],

      telefono: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(/^\d+$/)
        ]
      ]

    });
  }

  /**
   * Resetear formulario
   */
  onReset(): void {

    if (this.isCreate) {

      this.userCreate.reset();

      return;
    }

    /*
     * Restaurar datos originales.
     */
    this.resetUsuario(
      this.usuarioOriginal
    );

    this.userCreate.markAsPristine();

    this.userCreate.markAsUntouched();

    /*
     * Cerramos solamente este diálogo.
     */
    this.dialogRef.close({
      success: false,
      action: 'cancel'
    });
  }

  /**
   * Restaurar datos del usuario
   */
  private resetUsuario(
    usuario: any
  ): void {

    if (!usuario) {
      return;
    }

    this.userCreate.patchValue({

      id: usuario.id,

      nombre: usuario.nombre,

      email: usuario.email,

      telefono: usuario.telefono

    });
  }

  /**
   * Cargar usuario para editar
   */
  cargarUsuario(id: number): void {

    this.usuarioService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (usuario) => {

          console.log(
            'Usuario cargado:',
            usuario
          );

          /*
           * Guardamos una copia original.
           */
          this.usuarioOriginal = {
            ...usuario
          };

          this.originalEmail =
            usuario.email;

          /*
           * Cargamos datos al formulario.
           */
          this.userCreate.patchValue({

            nombre: usuario.nombre,

            email: usuario.email,

            id: usuario.id,

            telefono: usuario.telefono

          });
        },

        error: (error) => {

          console.error(
            'Error al cargar usuario:',
            error
          );

          this.noti.error(
            'Error',
            'No se pudo cargar el usuario'
          );
        }
      });
  }

  /**
   * Submit principal
   */
  submitForm(): void {

    this.userCreate.markAllAsTouched();

    console.log(
      'Formulario válido:',
      this.userCreate.valid
    );

    console.log(
      'Errores formulario:',
      this.userCreate.errors
    );

    console.log(
      'Valores:',
      this.userCreate.value
    );

    Object.keys(
      this.userCreate.controls
    ).forEach(key => {

      const control =
        this.userCreate.get(key);

      console.log(
        key,
        'valid:',
        control?.valid,
        'errors:',
        control?.errors
      );

    });

    this.makeSubmit = true;

    /*
     * Validación.
     */
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

  /**
   * Actualizar usuario
   */
  actualizarUsuario(): void {

    const value = {
      ...this.userCreate.value
    };

    /*
     * En actualización no enviamos password.
     */
    delete value.password;

    /*
     * Convertir teléfono a número.
     */
    value.telefono = value.telefono
      ? Number(value.telefono)
      : null;

    console.log(
      'Payload Update:',
      value
    );

    this.usuarioService
      .update(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: () => {

          this.noti.success(
            'Éxito',
            'Usuario actualizado exitosamente',
            3000
          );

          /*
           * Avisamos al componente UsuarioAdmin
           * que la operación fue exitosa.
           */
          this.dialogRef.close({

            success: true,

            action: 'update'

          });
        },

        error: (error) => {

          console.error(
            'Error al actualizar usuario:',
            error
          );

          this.noti.error(
            'Error',
            'No se pudo actualizar el usuario',
            3000
          );
        }
      });
  }

  /**
   * Crear usuario
   */
  guardarUsuario(): void {

    const value = {
      ...this.userCreate.value
    };

    /*
     * Convertir teléfono a número.
     */
    value.telefono = value.telefono
      ? Number(value.telefono)
      : null;

    console.log(
      'Payload Create:',
      value
    );

    this.usuarioService
      .create(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (data: any) => {

          console.log(
            'Usuario creado:',
            data
          );

          this.noti.success(
            'Éxito',
            'Usuario creado exitosamente',
            3000
          );

          /*
           * Avisamos al componente padre.
           */
          this.dialogRef.close({

            success: true,

            action: 'create'

          });
        },

        error: (error) => {

          console.error(
            'Error al crear usuario:',
            error
          );

          this.noti.error(
            'Error',
            'No se pudo crear el usuario',
            3000
          );
        }
      });
  }

  /**
   * Manejo de errores
   */
  public errorHandling(
    controlPath: string
  ): string | false {

    return getFormValidationErrorMessage(
      this.userCreate,
      controlPath
    );
  }

  /**
   * Destruir componente
   */
  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }
}