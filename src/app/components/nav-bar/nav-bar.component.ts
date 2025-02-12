import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone:false
})
export class NavBarComponent {
  isMenuOpen = false;
  currentPage: string = '';

  menuItems = [
    { label: 'Home', route: '/home' },
    { label: 'Sesiones', route: '/sesiones' },
    { label: 'Entrenamientos', route: '/entrenamientos' },
    { label: 'Jugadores', route: '/jugadores' },
    { label: 'Entrenadores', route: '/entrenadores' },
    { label: 'Mi Perfil', route: '' } // Abrirá modal en el futuro
  ];

  constructor(private router: Router) {
    this.currentPage = this.router.url;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
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
