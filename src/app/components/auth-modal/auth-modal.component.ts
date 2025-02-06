import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  standalone:false
})
export class AuthModalComponent {
  @Input() isLoginMode = true;
  @Output() close = new EventEmitter<void>();

  showPassword = false;
  showConfirmPassword = false;

  closeModal() {
    this.close.emit();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm-password') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
