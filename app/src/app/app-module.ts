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

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    CoreModule,
    ShareModule,
    HomeModule,
    AppRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    /* provideAnimations(), */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    }

  ],
  bootstrap: [App],
})
export class AppModule {

}