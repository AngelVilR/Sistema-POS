import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteRoutingModule } from './reporte-routing-module';
import { ReporteAdmin } from './reporte-admin/reporte-admin';
import { AgCharts } from 'ag-charts-angular';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ReporteAdmin],
  imports: [CommonModule, ReporteRoutingModule, AgCharts, MatButtonModule],
})
export class ReporteModule {}
