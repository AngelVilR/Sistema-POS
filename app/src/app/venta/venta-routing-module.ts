import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentaAdmin } from './venta-admin/venta-admin';

const routes: Routes = [
  { path: 'venta-admin', component: VentaAdmin }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentaRoutingModule {}
