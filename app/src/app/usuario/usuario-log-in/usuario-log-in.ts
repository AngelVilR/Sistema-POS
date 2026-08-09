import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../share/authentication.service';
import { UsuarioService } from '../../share/services/usuario.service';
import { getFormValidationErrorMessage } from '../../share/form-validation';

@Component({
  selector: 'app-usuario-log-in',
  standalone: false,
  templateUrl: './usuario-log-in.html',
  styleUrl: './usuario-log-in.css',
})
export class UsuarioLogIn {

  datos: any;
  validateEmails:any;
  hide=true;
  formulario!: FormGroup;
  makeSubmit: boolean = false;
  infoUsuario: any;
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private usuarioService: UsuarioService,
    private noti: NotificationService
  ) {
  }
  ngOnInit(): void {
   this.initForm();
  }

  private initForm(): void{
    this.formulario = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6),
      Validators.pattern(/^\d+$/)
      ]],
    });
  }

  onReset() {
    this.formulario.reset();
  }
  submitForm() {
    this.formulario.markAllAsTouched();
    this.makeSubmit=true;
    //Validación
    if(this.formulario.invalid){
    this.noti.error(
      'Formulario Inválido',
      'Por favor revise los campos del formulario e intente nuevamente.',
      5000
    );
     return;
    }
    //Login
    //Obtener los datos del formulario
    const credentials=this.formulario.value
    this.authService.loginUser(credentials).subscribe({ 
      next:()=>{
        this.noti.success('Iniciar sesión', 'Bienvenido',2000, '/inicio')
      },
      error: (error)=>{
        console.log('Error inicio de sesión ', error)
        console.log("Datos", this.formulario.value)
        let message='Error al iniciar sesión. Por favor, intente nuevamente.'
        if(error.status=== 401){
          message='Usuario o contraseña inválidos. Por favor, intente nuevamente.'
        }
        this.noti.error('Error de Autenticación',message)
      }
    })
    
  }

     public errorHandling(controlPath: string): string | false {
       // Pasamos el formulario principal y la ruta del control
       return getFormValidationErrorMessage(this.formulario, controlPath);
     }

}
