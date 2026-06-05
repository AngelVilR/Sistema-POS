import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentaRoutingModule } from './venta-routing-module';
import { VentaAdmin } from './venta-admin/venta-admin';
import { VentaForm } from './venta-form/venta-form';

@NgModule({
  declarations: [VentaAdmin, VentaForm],
  imports: [CommonModule, VentaRoutingModule],
})
export class VentaModule {}
