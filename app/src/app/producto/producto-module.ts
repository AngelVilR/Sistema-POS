import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing-module';
import { ProductoAdmin } from './producto-admin/producto-admin';
import { ProductoForm } from './producto-form/producto-form';

@NgModule({
  declarations: [ProductoAdmin, ProductoForm],
  imports: [CommonModule, ProductoRoutingModule],
})
export class ProductoModule {}
