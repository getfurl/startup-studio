import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component } from '@angular/core';
import { RouteMode, RouteData } from './app-routing.module';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <app-header [viewMode]="viewMode"></app-header>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  viewMode: RouteMode

  constructor(private _route: ActivatedRoute, private _router: Router) {
    /** We extract the current view mode currently selected by the router upon NavigationEnd */
    this._router.events.pipe(
        filter((event => event instanceof NavigationEnd)),
        map(() => this._route)
      )
      .subscribe(currentRoute => {
        currentRoute.firstChild.data.subscribe((routeData: RouteData) => {
          this.viewMode = routeData.viewMode;
        })
      })
  }

  ngOnInit() {
    
  }
}
