import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-accept-gestor-modal',
  templateUrl: './accept-gestor-modal.component.html',
  styleUrls: ['./accept-gestor-modal.component.scss'],
  standalone: false
})
export class AcceptGestorModalComponent {
  @Input() entrenadorId: string = ''; 
  @Output() closeModal = new EventEmitter<void>();

  cerrarModal() {
    this.closeModal.emit();
  }

  //Si el entrandor acepta la solicitud
  async aceptarSolicitud() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);

      await updateDoc(entrenadorRef, {
        roles: ['Gestor'],
        pendingGestorRequest: false
      });

    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
    }

    this.cerrarModal();
  }


  //Si el ennrreandor rechaza la solicutd
  async rechazarSolicitud() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);

      await updateDoc(entrenadorRef, { pendingGestorRequest: false });

    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }

    this.cerrarModal();
  }
}
