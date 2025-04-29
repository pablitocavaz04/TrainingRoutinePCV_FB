import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone:false
})
export class NavBarComponent implements OnInit {
  isMenuOpen = false;
  currentPage: string = '';
  isProfileOpen = false;
  userRoles: string[] = [];
  isLanguageModalOpen = false;
  currentLanguage = 'es';
  currentLanguageName = 'Español';
  currentLanguageFlag = 'assets/flags/es.png'; // Ahora es una imagen

  menuItems = [
    { label: 'Sobre Mi', route: '/about-me'},
    { label: 'Home', route: '/home' },
    { label: 'Entrenamientos', route: '/entrenamientos' },
    { label: 'Entrenadores', route: '/entrenadores' }
  ];

  constructor(
    private router: Router, 
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadUserRoles();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentPage = event.urlAfterRedirects;
      }
    });

    // Establecer idioma actual
    this.updateLanguage(this.translate.currentLang || 'es');
  }

  loadUserRoles() {
    const role = this.authService.getSelectedRole();
    this.userRoles = role ? role.split(',') : [];
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  navigateTo(route: string) {
    if (route) {
      this.router.navigate([route]).then(() => {
        this.currentPage = route;
        this.isMenuOpen = false;
      });
    }
  }

  openLanguageModal() {
    this.isLanguageModalOpen = true;
  }

  closeLanguageModal() {
    this.isLanguageModalOpen = false;
  }

  updateLanguage(lang: string) {
    const languages: Record<string, { name: string; flag: string }> = {
      'es': { name: 'Español', flag: 'assets/flags/es.png' },
      'en': { name: 'English', flag: 'assets/flags/en.png' }
    };
  
    if (languages[lang]) {
      this.currentLanguage = lang;
      this.currentLanguageName = languages[lang].name;
      this.currentLanguageFlag = languages[lang].flag;
    }
  }
}
