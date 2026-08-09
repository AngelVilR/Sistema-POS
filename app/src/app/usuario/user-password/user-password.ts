import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from '../../share/services/usuario.service';
import { AuthenticationService } from '../../share/authentication.service';
import { NotificationService } from '../../share/notification-service';
import { UsuarioModel } from '../../share/models/UsuarioModel';
import { getFormValidationErrorMessage } from '../../share/form-validation';

@Component({
  selector: 'app-user-password',
  standalone: false,
  templateUrl: './user-password.html',
  styleUrl: './user-password.css',
})
export class UserPassword {

  userPassword!: FormGroup<any>;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserPassword>,
    private usuarioService: UsuarioService,
    private authService: AuthenticationService,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();   // 👈 inicializa el formulario aquí
  }

  private initForm(): void {
    this.userPassword = this.fb.group({
      newPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6),
      Validators.pattern(/^\d+$/)
      ]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6),
      Validators.pattern(/^\d+$/)
      ]]
    }, {
      validators: [this.passwordMatchValidator.bind(this)]
    })
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  submit() {


    if (this.userPassword.invalid) return;

    const user = this.authService.currentUserSignal(); 
    const idUser = user?.id;

    if (!idUser) {
      this.noti.error('Error', 'No se pudo identificar al usuario logueado');
      return;
    }

    const contrasena = this.userPassword.value.newPassword;

    const usuarioParcial: Partial<UsuarioModel> = {
    id: idUser,
    password: contrasena
  };

    this.usuarioService.updatePassword(usuarioParcial as UsuarioModel)
      .subscribe(() => {
        this.noti.success('Contraseña actualizada', 'Tu contraseña fue cambiada exitosamente', 3000);
        this.dialogRef.close();
      });
  }

  onReset() {
    this.dialogRef.close();
  }

  public errorHandling(controlPath: string): string | false {
      // Pasamos el formulario principal y la ruta del control
      return getFormValidationErrorMessage(this.userPassword, controlPath);
    }
  
}
