import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: false
})
export class NavBarComponent {
  isMenuOpen = false;
  currentPage: string = '';
  isProfileOpen = false;

  menuItems = [
    { label: 'Home', route: '/home' },
    { label: 'Sesiones', route: '/sesiones' },
    { label: 'Entrenamientos', route: '/entrenamientos' },
    { label: 'Jugadores', route: '/jugadores' },
    { label: 'Entrenadores', route: '/entrenadores' },
  ];

  constructor(private router: Router) {
    this.currentPage = this.router.url;
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
        this.isMenuOpen = false; // Cierra el menú tras la navegación en móviles
      });
    }
  }
}
