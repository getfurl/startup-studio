import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header class="furl-header">
    <span class="furl-logo">Furl</span>
    <app-auth-control></app-auth-control>
    </header>
    <section class="furl-nav">
      <a [routerLink]="['/']">Home</a>
      <a [routerLink]="['/submit']">Receive Feedback</a>
      <a [routerLink]="['/rate']">Give Feedback</a>
    </section>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
}
