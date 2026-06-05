import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing-module';
import { UsuarioAdmin } from './usuario-admin/usuario-admin';
import { UsuarioForm } from './usuario-form/usuario-form';
import { UsuarioLogIn } from './usuario-log-in/usuario-log-in';

@NgModule({
  declarations: [UsuarioAdmin, UsuarioForm, UsuarioLogIn],
  imports: [CommonModule, UsuarioRoutingModule],
})
export class UsuarioModule {}
