import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false
})
export class ProfileModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() userName: string = "Nombre de Usuario";
  @Input() userEmail: string = "usuario@email.com";
  @Input() userImage: string = "https://via.placeholder.com/100";
  @Output() close = new EventEmitter<void>();

  modalState: 'open' | 'closed' = 'closed';

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
