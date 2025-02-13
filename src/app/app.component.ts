import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  isLandingOrSplashPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.isLandingOrSplashPage = currentUrl === '/landing' || currentUrl === '/splash';
    });
  }
}
