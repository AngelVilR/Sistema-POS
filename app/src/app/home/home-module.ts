import { NgModule } from '@angular/core';
import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing-module';
import { Inicio } from './inicio/inicio';
import { ProductoModule } from "../producto/producto-module";


@NgModule({
  declarations: [Inicio],
  imports: [CommonModule, HomeRoutingModule, ProductoModule],
})
export class HomeModule { }
