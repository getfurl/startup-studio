import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { SubmitComponent } from './views/submit/submit.component';
import { RateComponent } from './views/rate/rate.component';
import { EditComponent } from './views/edit/edit.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "submit", component: SubmitComponent },
  { path: "rate", component: RateComponent },
  { path: "edit/:id", component: EditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
