import { Component, computed, inject, output, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserPassword } from '../../usuario/user-password/user-password';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../share/authentication.service';
import { UtilService } from '../../share/util-service';
import { Subject } from 'rxjs';
import { CarritoService } from '../../share/carrito.service';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  private carritoServ = inject(CarritoService)
  private authService = inject(AuthenticationService)

  showFiller = false;
  private dialogForm = inject(MatDialog);
  user: any;
  userSignal!: () => any;
  labelRolUser: Signal<any> = this.authService.userRoleCurrent
  isAuth: Signal<boolean> = this.authService.authenticated

  cerrarDrawer = output<void>();

  constructor(
    private router: Router,
    private utilService: UtilService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserSignal();
    this.userSignal = this.authService.currentUserSignal;    
    console.log('Usuario logueado:', this.user)
  }

  logout() {
    this.cerrarDrawer.emit()
    this.authService.logout();
    this.carritoServ.vaciarCarrito();
  }

  public isAdmin = computed(() => {
    const user = this.authService.currentUserSignal()
    /* console.log('User: ', user); */
    return user?.role.toString() == 'ADMIN'
  })

  openDialogChangePassword() {
    this.dialogForm.open(UserPassword);
  }
}
