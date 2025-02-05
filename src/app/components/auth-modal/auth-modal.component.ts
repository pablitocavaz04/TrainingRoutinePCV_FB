import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  standalone:false
})
export class AuthModalComponent {
  @Input() isLoginMode: boolean = true; // Este estado lo recibimos desde la landing page.
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
