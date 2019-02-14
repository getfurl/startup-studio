import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { RateComponent } from './views/rate/rate.component';
import { SubmitComponent } from './views/submit/submit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RateComponent,
    SubmitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
