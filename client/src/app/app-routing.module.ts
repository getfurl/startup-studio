import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { SubmitComponent } from './views/submit/submit.component';
import { RateComponent } from './views/rate/rate.component';
import { EditComponent } from './views/edit/edit.component';
import { ResultsComponent } from './views/results/results.component';

import { CanActivateOwner, CanActivateTester, routeProviders } from './shared/auth/auth.guard';

export enum RouteMode {
  Owner, Tester
}

export interface RouteData {
  mode: RouteMode
}

const routeData = (routeData: RouteData): RouteData => Object.assign({}, routeData)

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "submit", component: SubmitComponent, canActivate: [CanActivateOwner], data: routeData({ mode: RouteMode.Owner }) },
  { path: "rate/:id", component: RateComponent, canActivate: [CanActivateTester], data: routeData({ mode: RouteMode.Tester }) },
  { path: "edit/:id", component: EditComponent, canActivate: [CanActivateOwner], data: routeData({ mode: RouteMode.Owner })},
  { path: "results/:id", component: ResultsComponent, canActivate: [CanActivateOwner], data: routeData({ mode: RouteMode.Owner })}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [...routeProviders]
})
export class AppRoutingModule { }
