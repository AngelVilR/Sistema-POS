import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductoRoutingModule } from './producto-routing-module';
import { ProductoAdmin } from './producto-admin/producto-admin';
import { ProductoForm } from './producto-form/producto-form';
import { ProductoIndex } from './producto-index/producto-index';

@NgModule({
  declarations: [ProductoAdmin, ProductoForm, ProductoIndex],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ProductoRoutingModule
  ],
  exports: [ProductoIndex],
})
export class ProductoModule { }
