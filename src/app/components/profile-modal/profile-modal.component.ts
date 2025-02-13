import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false
})
export class ProfileModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() userImage: string = "https://via.placeholder.com/100";
  @Output() close = new EventEmitter<void>();

  modalState: 'open' | 'closed' = 'closed';
  userEmail: string = "Cargando...";

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        this.userEmail = user.email || "Correo no disponible";
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["isOpen"]) {
      if (this.isOpen) {
        setTimeout(() => {
          this.modalState = 'open';
        }, 10);
      } else {
        this.modalState = 'closed';
      }
    }
  }

  closeModal() {
    this.modalState = 'closed';
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }
}
