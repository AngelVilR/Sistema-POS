import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentaAdmin } from './venta-admin/venta-admin';
import { VentaDetail } from './venta-detail/venta-detail';
import { VentaAsignarForm } from './venta-asignar-form/venta-asignar-form';

const routes: Routes = [
  { path: 'venta-admin', component: VentaAdmin },
  { path: 'venta-asignar', component: VentaAsignarForm },
  { path: 'venta-detail', component: VentaDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentaRoutingModule {}
