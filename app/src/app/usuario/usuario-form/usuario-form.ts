import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UsuarioService } from '../../share/services/usuario.service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { NotificationService } from '../../share/notification-service';

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
   titleForm: string = 'Crear';
idUsuario: number | null = null;
isCreate: boolean = true;
  private destroy$ = new Subject<boolean>();
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private noti: NotificationService
  ){}

  ngOnInit(): void {
  this.initForm();

  this.route.params.subscribe(params => {
    this.idUsuario = params['id'];

    this.isCreate = this.idUsuario === undefined;
    this.titleForm = this.isCreate ? 'Crear Usuario' : 'Actualizar Usuario';

    if (!this.isCreate) {
      this.cargarUsuario(this.idUsuario!);
    }
  });
}

  private initForm(){
    this.userCreate = this.fb.group({
      id: [null],
      nombre: [null],
      email: [null],
      password: [null],
      telefono: [null]
    })}
  
  onReset(){
    this.userCreate.reset();
  }

  cargarUsuario(id: number) {
  this.usuarioService.getById(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(usuario => {

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
    this.makeSubmit=true;
    //Validación
    if(this.userCreate.invalid){
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

  if(!this.isCreate){
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
        '/usuario-admin'
      );

    });
}

  guardarUsuario(){
    const value = this.userCreate.value;
    value.telefono = value.telefono? Number(value.telefono): null;

    this.usuarioService
    .create(value)
    .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              this.noti.success(
                'Exito','Usuario creado exitosamente',
                3000,
                "/usuario-admin"
              )
            });
  }

  public errorHandling(controlPath: string): string | false {
       // Pasamos el formulario principal y la ruta del control
       return getFormValidationErrorMessage(this.userCreate, controlPath);
     }
}
