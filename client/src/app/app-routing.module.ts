import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { SubmitComponent } from './views/submit/submit.component';
import { RateComponent } from './views/rate/rate.component';
import { EditComponent } from './views/edit/edit.component';
import { ResultsComponent } from './views/results/results.component';
import { UserDashboardComponent } from './views/user/user-dashboard/user-dashboard.component';
import { FeedbackRequestsListComponent } from './views/user/feedback-requests-list/feedback-requests-list.component';
import { FeedbackHistoryComponent } from './views/user/feedback-history/feedback-history.component';

import { CanActivateAdmin, CanActivateTester, routeProviders } from './shared/auth/auth.guard';

export enum RouteMode {
  Admin, Tester
}

export interface RouteData {
  viewMode: RouteMode
}

const routeData = (routeData: RouteData): RouteData => Object.assign({}, routeData)

/**
 * user
 * user/tests
 * user/history
 */

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "submit", component: SubmitComponent, canActivate: [CanActivateAdmin], data: routeData({ viewMode: RouteMode.Admin }) },
  { path: "rate/:id", component: RateComponent, canActivate: [CanActivateTester], data: routeData({ viewMode: RouteMode.Tester }) },
  { path: "edit/:id", component: EditComponent, canActivate: [CanActivateAdmin], data: routeData({ viewMode: RouteMode.Admin })},
  { path: "results/:id", component: ResultsComponent, canActivate: [CanActivateAdmin], data: routeData({ viewMode: RouteMode.Admin })},
  { path: ":userName", component: UserDashboardComponent},
  { path: ":userName/tests", component: FeedbackRequestsListComponent, canActivate: [CanActivateAdmin], data: routeData({ viewMode: RouteMode.Admin }) },
  { path: ":userName/history", component: FeedbackHistoryComponent, canActivate: [CanActivateTester], data: routeData({ viewMode: RouteMode.Tester }) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [...routeProviders]
})
export class AppRoutingModule { }
