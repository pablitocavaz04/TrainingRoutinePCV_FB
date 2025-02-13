import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.scss'],
  standalone: false
})
export class ChangeProfileComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  confirmChange() {
    this.confirm.emit();
  }

  closeModal() {
    this.cancel.emit(); 
  }
}
