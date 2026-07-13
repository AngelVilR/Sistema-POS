import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioAdmin } from './usuario-admin/usuario-admin';
import { UsuarioForm } from './usuario-form/usuario-form';
import { UsuarioLogIn } from './usuario-log-in/usuario-log-in';

const routes: Routes = [
  { path: 'usuario-admin', component: UsuarioAdmin },
  { path: 'usuario/create', component: UsuarioForm },
  { path: 'usuario/update/:id', component: UsuarioForm },
  { path: 'iniciar-sesión', component: UsuarioLogIn },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule { }
