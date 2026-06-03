import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing-module';
import { Inicio } from './inicio/inicio';

@NgModule({
  declarations: [Inicio],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule { }
