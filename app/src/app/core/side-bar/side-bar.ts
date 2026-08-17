import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserPassword } from '../../usuario/user-password/user-password';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../share/authentication.service';
import { UtilService } from '../../share/util-service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  showFiller = false;
  private dialogForm = inject(MatDialog);
  user: any;
  userSignal!: () => any;

  constructor(
    private router: Router,
    private utilService: UtilService,
    private authService: AuthenticationService
  ){}

  ngOnInit(): void {
    this.user = this.authService.currentUserSignal();
    this.userSignal = this.authService.currentUserSignal;
     console.log('Usuario logueado:', this.user)
  }

  logout() {
    this.authService.logout();
  }

  public isAdmin=computed(()=>{
    const user=this.authService.currentUserSignal()
    /* console.log('User: ', user); */
    return user?.role.toString() =='ADMIN'
  })

  openDialogChangePassword() {
    this.dialogForm.open(UserPassword);
  }
}
