import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoAdmin } from './producto-admin/producto-admin';
import { ProductoForm } from './producto-form/producto-form';

const routes: Routes = [
  { path: 'producto-admin', component: ProductoAdmin },
  { path: 'producto/create', component: ProductoForm },
  { path: 'producto/update/:id', component: ProductoForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoRoutingModule { }
