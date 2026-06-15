import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaRoutingModule } from './venta-routing-module';
import { VentaAdmin } from './venta-admin/venta-admin';
import { VentaDetail } from './venta-detail/venta-detail';
import { VentaAsignarForm } from './venta-asignar-form/venta-asignar-form';

@NgModule({
  declarations: [VentaAdmin, VentaDetail, VentaAsignarForm],
  imports: [CommonModule, VentaRoutingModule],
  exports: [VentaDetail, VentaAsignarForm],
})
export class VentaModule {}
