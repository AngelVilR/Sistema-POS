import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteAdmin } from './reporte-admin/reporte-admin';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  { path: 'reporte-admin', 
    component: ReporteAdmin,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteRoutingModule {}
