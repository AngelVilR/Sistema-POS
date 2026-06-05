import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentaForm } from './venta-form/venta-form';
import { VentaAdmin } from './venta-admin/venta-admin';

const routes: Routes = [
  { path: 'venta-admin', component: VentaAdmin },
    { path: 'venta/create', component: VentaForm },
    { path: 'venta/update/:id', component: VentaForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentaRoutingModule {}
