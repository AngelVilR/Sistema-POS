import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaRoutingModule } from './venta-routing-module';
import { VentaAdmin } from './venta-admin/venta-admin';

@NgModule({
  declarations: [VentaAdmin],
  imports: [CommonModule, VentaRoutingModule],
})
export class VentaModule {}
