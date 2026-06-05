import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventoAdmin } from './evento-admin/evento-admin';
import { EventoForm } from './evento-form/evento-form';

const routes: Routes = [
  { path: 'evento-admin', component: EventoAdmin },
  { path: 'evento/create', component: EventoForm },
  { path: 'evento/update/:id', component: EventoForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoRoutingModule {}
