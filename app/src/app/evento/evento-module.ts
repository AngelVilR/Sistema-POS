import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { EventoRoutingModule } from './evento-routing-module';
import { EventoAdmin } from './evento-admin/evento-admin';
import { EventoForm } from './evento-form/evento-form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [EventoAdmin, EventoForm],
  imports: [CommonModule,
    MatInputModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    EventoRoutingModule,
  ReactiveFormsModule,
 MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  ],
})
export class EventoModule {}
