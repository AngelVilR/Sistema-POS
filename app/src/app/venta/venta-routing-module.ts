import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentaAdmin } from './venta-admin/venta-admin';
import { VentaDetail } from './venta-detail/venta-detail';
import { VentaAsignarForm } from './venta-asignar-form/venta-asignar-form';
import { VentaAsignarAdmin } from './venta-asignar-admin/venta-asignar-admin';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  { path: 'venta-admin', 
    component: VentaAdmin,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']}},
  { path: 'asignar-producto', 
    component: VentaAsignarAdmin,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']}},
  { path: 'asignar-producto/create', 
    component: VentaAsignarForm,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']} },
  { path: 'asignar-producto/update/:eventoId/:usuarioId/:productoId', 
    component: VentaAsignarForm,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']} },
  { path: 'venta-detail/:id', 
    component: VentaDetail,
    canActivate: [authGuard],
    data: {roles: ['ADMIN']} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentaRoutingModule {}
