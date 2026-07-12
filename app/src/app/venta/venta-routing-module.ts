import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentaAdmin } from './venta-admin/venta-admin';
import { VentaDetail } from './venta-detail/venta-detail';
import { VentaAsignarForm } from './venta-asignar-form/venta-asignar-form';
import { VentaAsignarAdmin } from './venta-asignar-admin/venta-asignar-admin';

const routes: Routes = [
  { path: 'venta-admin', component: VentaAdmin },
  { path: 'asignar-producto', component: VentaAsignarAdmin },
  { path: 'asignar-producto/create', component: VentaAsignarForm },
  { path: 'asignar-producto/update/:eventoId/:usuarioId/:productoId', component: VentaAsignarForm },
  { path: 'venta-detail/:id', component: VentaDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentaRoutingModule {}
