import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-rol',
  templateUrl: './edit-rol.component.html',
  styleUrls: ['./edit-rol.component.scss'],
  standalone: false
})
export class EditRolComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateRole = new EventEmitter<string>();

  cerrarModal() {
    this.closeModal.emit();
  }

  convertirEnEntrenador() {
    this.updateRole.emit('convertir');
    this.cerrarModal();
  }

  anadirEntrenador() {
    this.updateRole.emit('añadir');
    this.cerrarModal();
  }
}
