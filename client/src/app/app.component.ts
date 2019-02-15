import { Component } from '@angular/core';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <header class="furl-header">
    <span class="furl-logo" [routerLink]="['/']">Furl</span>
    <app-auth-control></app-auth-control>
    </header>
    <section class="furl-nav">
      <a [routerLink]="['/submit']" *ngIf="user">Get Feedback</a>
    </section>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  user: firebase.User;

  constructor(private _auth: AuthService) {
    this._auth.state.subscribe(user => this.user = user);
  }

  ngOnInit() {
    
  }
}
