import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: false
})
export class NavBarComponent implements OnInit {
  isMenuOpen = false;
  currentPage: string = '';
  isProfileOpen = false;
  userRoles: string[] = [];

  menuItems = [
    { label: 'Home', route: '/home' },
    { label: 'Entrenamientos', route: '/entrenamientos' },
    { label: 'Entrenadores', route: '/entrenadores' }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loadUserRoles();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentPage = event.urlAfterRedirects;
      }
    });
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
}
