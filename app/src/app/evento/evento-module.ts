import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventoRoutingModule } from './evento-routing-module';
import { EventoAdmin } from './evento-admin/evento-admin';
import { EventoForm } from './evento-form/evento-form';

@NgModule({
  declarations: [EventoAdmin, EventoForm],
  imports: [CommonModule, EventoRoutingModule],
})
export class EventoModule {}
