import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioAdmin } from './usuario-admin/usuario-admin';
import { UsuarioForm } from './usuario-form/usuario-form';
import { UsuarioLogIn } from './usuario-log-in/usuario-log-in';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  { path: 'usuario-admin', 
    component: UsuarioAdmin,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']}

   },
  { path: 'usuario/create', 
    component: UsuarioForm,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']} },
  { path: 'usuario/update/:id', 
    component: UsuarioForm,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']} },
  { path: 'iniciar-sesion', component: UsuarioLogIn },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule { }
