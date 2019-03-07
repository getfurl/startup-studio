import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from './shared/auth/auth.service';
import { RouteMode, RouteData } from './app-routing.module';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <header class="furl-header" [ngClass]="['app-mode-' + mode]">
      <span class="furl-logo" [routerLink]="['/']">furl</span>
      <app-mode-caption [mode]="mode"></app-mode-caption>
      <span class="furl-header-spacer"></span>
      <button mat-flat-button class="furl-header-feedback-button" [routerLink]="['/submit']">Get Feedback</button>
      <app-auth-control></app-auth-control>
    </header>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  user: firebase.User;
  mode: RouteMode

  constructor(private _auth: AuthService, private _route: ActivatedRoute, private _router: Router) {
    this._auth.state.subscribe(user => this.user = user);
    this._router.events.pipe(
        filter((event => event instanceof NavigationEnd)),
        map(() => this._route)
      )
      .subscribe(currentRoute => {
        currentRoute.firstChild.data.subscribe((routeData: RouteData) => {
          this.mode = routeData.mode;
        })
      })
  }

  ngOnInit() {
    
  }
}
