import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProgramasComponent } from './modulos/inicio/component/programas/programas.component';
import { InicioComponent } from './modulos/inicio/component/inicio/inicio.component';
@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    ProgramasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

  ],
  exports:[    InicioComponent,
    ProgramasComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
