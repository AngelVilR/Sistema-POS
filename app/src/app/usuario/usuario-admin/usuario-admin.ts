import {
  Component,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { UsuarioService } from '../../share/services/usuario.service';
import { UsuarioModel } from '../../share/models/UsuarioModel';

import { MatDialog } from '@angular/material/dialog';
import { UsuarioForm } from '../usuario-form/usuario-form';

import { UtilService } from '../../share/util-service';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-usuario-admin',
  standalone: false,
  templateUrl: './usuario-admin.html',
  styleUrl: './usuario-admin.css',
})
export class UsuarioAdmin implements OnInit, OnDestroy {

  data: UsuarioModel[] = [];
  dataLength = 0;

  destroy$ = new Subject<void>();

  private dialogForm = inject(MatDialog);

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UsuarioService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.listUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar usuarios
   */
  private listUsers(): void {

    console.log('Cargando usuarios...');

    this.userService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: UsuarioModel[]) => {

          console.log('Usuarios recibidos:', respuesta);

          respuesta.forEach((usuario: UsuarioModel) => {
            usuario.formatoRole =
              this.util.RoleUsuarioToString(usuario.role);
          });

          this.data = respuesta ?? [];
          this.dataLength = this.data.length;

          console.log('data:', this.data);
          console.log('dataLength:', this.dataLength);

          /*
           * Forzamos a Angular a detectar el cambio.
           */
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al cargar usuarios:',
            error
          );

          this.noti.error(
            'Error',
            'Error al cargar los usuarios'
          );

          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Crear usuario
   */
  openDialogCreateUsuario(): void {

    console.log('Abriendo formulario de crear usuario');

    const dialogRef = this.dialogForm.open(UsuarioForm, {
      width: '600px',
      maxWidth: '95vw',
      disableClose: true
    });

    /*
     * Detectar cuando el diálogo termina de abrirse.
     */
    dialogRef.afterOpened()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {

        console.log('Formulario de usuario abierto');

        this.cdr.detectChanges();
      });

    /*
     * Detectar cuando el formulario se cierra.
     */
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resultado) => {

        console.log(
          'Resultado formulario crear:',
          resultado
        );

        if (resultado?.success) {

          /*
           * Volvemos a cargar los usuarios.
           */
          this.listUsers();

          /*
           * Forzamos la actualización visual.
           */
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Actualizar usuario
   */
  openDialogUpdateUsuario(
    usuario: UsuarioModel
  ): void {

    console.log(
      'Abriendo formulario para usuario:',
      usuario
    );

    const dialogRef = this.dialogForm.open(UsuarioForm, {
      width: '600px',
      maxWidth: '95vw',
      disableClose: true,
      data: usuario
    });

    dialogRef.afterOpened()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {

        console.log(
          'Formulario de actualización abierto'
        );

        this.cdr.detectChanges();
      });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resultado) => {

        console.log(
          'Resultado formulario actualizar:',
          resultado
        );

        if (resultado?.success) {

          /*
           * Volvemos a consultar los usuarios.
           */
          this.listUsers();

          /*
           * Forzamos el refresco visual.
           */
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Este método lo dejo por si en otra parte de tu
   * aplicación utilizas navegación en lugar de diálogo.
   */
  crearUsuario(): void {
    this.router.navigate(['/usuario/create']);
  }

  /**
   * Este método lo dejo por compatibilidad con tu código.
   */
  actualizarUsuario(id: number): void {
    this.router.navigate(
      ['/usuario/update', id]
    );
  }

  /**
   * Resetear contraseña
   */
  resetearPassword(idUser: number): void {

    const usuarioParcial: Partial<UsuarioModel> = {
      id: idUser,
      password: '000000'
    };

    this.userService
      .updatePassword(
        usuarioParcial as UsuarioModel
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: () => {

          this.authService
            .getUserProfile()
            .subscribe();

          this.noti.success(
            'Contraseña reseteada',
            'La contraseña ha sido reseteada a "000000" exitosamente.',
            3000
          );

          /*
           * Forzar actualización.
           */
          this.cdr.detectChanges();
        },

        error: () => {

          this.noti.error(
            'Error',
            'No se pudo resetear la contraseña.'
          );

          this.cdr.detectChanges();
        }
      });
  }
}