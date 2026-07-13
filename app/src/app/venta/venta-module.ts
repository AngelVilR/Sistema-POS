import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { VentaRoutingModule } from './venta-routing-module';
import { VentaAdmin } from './venta-admin/venta-admin';
import { VentaDetail } from './venta-detail/venta-detail';
import { VentaAsignarForm } from './venta-asignar-form/venta-asignar-form';
import { VentaAsignarAdmin } from './venta-asignar-admin/venta-asignar-admin';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogContent } from "@angular/material/dialog";

@NgModule({
  declarations: [VentaAdmin, VentaDetail, VentaAsignarForm, VentaAsignarAdmin],
  imports: [CommonModule,
    MatInputModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    VentaRoutingModule, FormsModule, ReactiveFormsModule, MatDialogContent],
  exports: [VentaDetail, VentaAsignarForm, VentaAsignarAdmin],
})
export class VentaModule { }
