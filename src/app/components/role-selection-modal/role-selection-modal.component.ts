import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-role-selection-modal',
  templateUrl: './role-selection-modal.component.html',
  styleUrls: ['./role-selection-modal.component.scss'],
  standalone: false
})
export class RoleSelectionModalComponent {
  @Input() roles: string[] = [];
  @Output() roleSelected = new EventEmitter<string>();

  selectRole(role: string) {
    this.roleSelected.emit(role); // 🔹 Emitimos solo el string del rol seleccionado
  }
}
