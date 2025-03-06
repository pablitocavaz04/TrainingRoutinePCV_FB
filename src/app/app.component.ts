import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // 🔹 Importamos AuthService
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  isLandingOrSplashPage = false;

  constructor(private router: Router, public authService: AuthService,private translate : TranslateService) {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.isLandingOrSplashPage = currentUrl === '/landing' || currentUrl === '/splash';
    });

    this.translate.setDefaultLang('es'); // Español por defecto
    this.translate.use('es'); // Aplicar idioma
  }
}
