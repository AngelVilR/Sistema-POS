import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteRoutingModule } from './reporte-routing-module';
import { ReporteAdmin } from './reporte-admin/reporte-admin';

@NgModule({
  declarations: [ReporteAdmin],
  imports: [CommonModule, ReporteRoutingModule],
})
export class ReporteModule {}
