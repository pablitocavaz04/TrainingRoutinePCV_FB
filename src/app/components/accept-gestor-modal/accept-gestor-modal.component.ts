import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-accept-gestor-modal',
  templateUrl: './accept-gestor-modal.component.html',
  styleUrls: ['./accept-gestor-modal.component.scss'],
  standalone: false
})
export class AcceptGestorModalComponent {
  @Input() entrenadorId: string = ''; // Recibe el ID del entrenador
  @Output() closeModal = new EventEmitter<void>();

  cerrarModal() {
    this.closeModal.emit();
  }

  async aceptarSolicitud() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);

      // ✅ Convertimos al usuario en Gestor y eliminamos la solicitud pendiente
      await updateDoc(entrenadorRef, {
        roles: ['Gestor'],
        pendingGestorRequest: false
      });

      console.log(`✅ El usuario ${this.entrenadorId} ahora es Gestor.`);
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
    }

    this.cerrarModal();
  }

  async rechazarSolicitud() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);

      // ❌ Eliminamos la solicitud pendiente sin cambiar el rol
      await updateDoc(entrenadorRef, { pendingGestorRequest: false });

      console.log(`❌ El usuario ${this.entrenadorId} ha rechazado ser Gestor.`);
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }

    this.cerrarModal();
  }
}
