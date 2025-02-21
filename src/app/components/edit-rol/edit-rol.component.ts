import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-rol',
  templateUrl: './edit-rol.component.html',
  styleUrls: ['./edit-rol.component.scss'],
  standalone:false
})
export class EditRolComponent {
  @Output() closeModal = new EventEmitter<void>();

  cerrarModal() {
    this.closeModal.emit();
  }
}
