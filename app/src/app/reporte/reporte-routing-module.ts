import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteAdmin } from './reporte-admin/reporte-admin';

const routes: Routes = [
  { path: 'reporte-admin', component: ReporteAdmin },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteRoutingModule {}
