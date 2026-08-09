import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { UsuarioRoutingModule } from './usuario-routing-module';
import { UsuarioAdmin } from './usuario-admin/usuario-admin';
import { UsuarioForm } from './usuario-form/usuario-form';
import { UsuarioLogIn } from './usuario-log-in/usuario-log-in';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsuarioAdmin, UsuarioForm, UsuarioLogIn],
  imports: [CommonModule,
    MatInputModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatCardModule,
    UsuarioRoutingModule,
    ReactiveFormsModule],
})
export class UsuarioModule { }
