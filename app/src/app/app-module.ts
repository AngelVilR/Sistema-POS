import { NgModule, provideBrowserGlobalErrorListeners, signal } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { ShareModule } from './share/share-module';
import { HomeModule } from './home/home-module';

import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
/* import { provideAnimations } from '@angular/platform-browser/animations'; */
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';

/* Modulos de disenno */
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

/* Modulos */
import { ProductoModule } from './producto/producto-module';
import { EventoModule } from './evento/evento-module';
import { VentaModule } from './venta/venta-module';
import { UsuarioModule } from './usuario/usuario-module';
import { CarritoModule } from './carrito/carrito-module';
import { ReporteModule } from './reporte/reporte-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    CoreModule,
    ShareModule,
    HomeModule,
    UsuarioModule,
    ProductoModule,
    EventoModule,
    VentaModule,        
    ReporteModule,
    CarritoModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    /* provideAnimations(), */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
