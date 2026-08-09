import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicio } from './home/inicio/inicio';
import { PageNotFound } from './share/page-not-found/page-not-found';
import { UsuarioLogIn } from './usuario/usuario-log-in/usuario-log-in';
import { authGuard } from './share/auth.guard';

const routes: Routes = [
  { path: 'iniciar-sesion', component: UsuarioLogIn },
  { path: '', redirectTo: '/iniciar-sesion', pathMatch: 'full' },
  {path: 'inicio', component: Inicio, canActivate: [authGuard]},
  { path: '**', component: PageNotFound }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
