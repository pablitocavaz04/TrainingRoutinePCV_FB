import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false
})
export class ProfileModalComponent {
  @Input() isOpen: boolean = false;
  @Input() userName: string = "Nombre de Usuario";
  @Input() userEmail: string = "usuario@email.com";
  @Input() userImage: string = "https://via.placeholder.com/100";
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
