import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header class="furl-header">Furl</header>
    <section class="furl-nav">
      <a [routerLink]="['/']">Home</a>
      <a [routerLink]="['/submit']">Get Feedback</a>
      <a [routerLink]="['/rate']">Give Feedback</a>
    </section>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
}
