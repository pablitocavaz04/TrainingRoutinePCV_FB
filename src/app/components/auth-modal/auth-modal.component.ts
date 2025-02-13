import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  standalone: false
})
export class AuthModalComponent {
  @Input() isLoginMode = true;
  @Output() close = new EventEmitter<void>();

  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = ''; 
  isLoading = false;
  
  showPassword = false;
  showConfirmPassword = false;

  constructor(public authService: AuthService, private router: Router) {}

  closeModal() {
    this.close.emit();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; 
  }

  async register() {
    this.errorMessage = '';
    if (!this.email.includes("@") || !this.email.includes(".")) {
      this.errorMessage = "El formato del correo electrónico es inválido.";
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Las contraseñas no coinciden.";
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.register(this.email, this.password);
      this.isLoginMode = true;
      this.errorMessage = "Registro exitoso. Ahora puedes iniciar sesión.";
    } catch (error: any) {
      this.errorMessage = "Error al registrar: " + error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async login() {
    this.errorMessage = '';
    if (!this.email.includes("@") || !this.email.includes(".")) {
      this.errorMessage = "El formato del correo electrónico es inválido.";
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.login(this.email, this.password);

      // 🔹 Si el usuario tiene que seleccionar un rol, esperar a que lo haga
      if (this.authService.showRoleModal) {
        return; 
      }

      this.navigateToHome();
    } catch (error: any) {
      this.errorMessage = "Error al iniciar sesión: " + error.message;
    } finally {
      this.isLoading = false;
    }
  }

  onRoleSelected(role: string) {
    if (this.authService.roleSelectionCallback) {
      this.authService.roleSelectionCallback(role);
    }
    this.navigateToHome();
  }

  navigateToHome() {
    this.closeModal();
    this.router.navigate(['/home']);
  }
}
