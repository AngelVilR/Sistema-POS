import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserPassword } from '../../usuario/user-password/user-password';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  showFiller = false;
  private dialogForm = inject(MatDialog)


  constructor(
    private router: Router
  ){}

  openDialogChangePassword() {
  this.dialogForm.open(UserPassword);
}
}
