import { NgModule } from '@angular/core';
import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing-module';
import { Inicio } from './inicio/inicio';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [Inicio],
  imports: [CommonModule, HomeRoutingModule, MatCardModule, MatButtonModule],
})
export class HomeModule { }
