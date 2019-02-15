import { Component } from '@angular/core';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <header class="furl-header">
    <span class="furl-logo" [routerLink]="['/']">Furl</span>
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

  constructor(private _auth: AuthService) {
    this._auth.state.subscribe(user => this.user = user);
  }

  ngOnInit() {
    
  }
}
