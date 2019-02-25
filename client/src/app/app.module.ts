import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { RateComponent } from './views/rate/rate.component';
import { SubmitComponent } from './views/submit/submit.component';
import { EditComponent } from './views/edit/edit.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ActionComponent } from './views/rate/action/action.component';
import { ResultsComponent } from './views/results/results.component';
import { ActionInsightComponent } from './views/results/action-insight/action-insight.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RateComponent,
    SubmitComponent,
    EditComponent,
    ActionComponent,
    ResultsComponent,
    ActionInsightComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
