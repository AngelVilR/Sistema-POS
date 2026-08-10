import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventoAdmin } from './evento-admin/evento-admin';
import { EventoForm } from './evento-form/evento-form';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  { path: 'evento-admin', 
    component: EventoAdmin, 
    canActivate: [authGuard],
    data: {roles: ['ADMIN']}
  },
  { path: 'evento/create', 
    component: EventoForm,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']} },
  { path: 'evento/update/:id', 
    component: EventoForm,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoRoutingModule {}
