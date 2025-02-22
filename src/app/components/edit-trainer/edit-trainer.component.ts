import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-edit-trainer',
  templateUrl: './edit-trainer.component.html',
  styleUrls: ['./edit-trainer.component.scss'],
  standalone: false
})
export class EditTrainerComponent {
  @Input() entrenadorId: string = ''; // Recibe el ID del entrenador a editar
  @Output() closeModal = new EventEmitter<void>();

  cerrarModal() {
    this.closeModal.emit();
  }

  async convertirEnJugador() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);

      await updateDoc(entrenadorRef, { roles: ['Jugador'] });

      console.log(`✅ El usuario ${this.entrenadorId} ahora es solo Jugador.`);
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
    }

    this.cerrarModal();
  }

  async anadirJugador() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);
      const entrenadorSnap = await getDoc(entrenadorRef);

      if (!entrenadorSnap.exists()) return;

      let roles = entrenadorSnap.data()['roles'] || [];
      if (!roles.includes('Jugador')) {
        roles.push('Jugador');
        await updateDoc(entrenadorRef, { roles });
        console.log(`✅ Jugador añadido al usuario ${this.entrenadorId}.`);
      }
    } catch (error) {
      console.error('Error al añadir Jugador:', error);
    }

    this.cerrarModal();
  }

  async proponerGestor() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);

      await updateDoc(entrenadorRef, { pendingGestorRequest: true });

      console.log(`✅ Solicitud de Gestor enviada para ${this.entrenadorId}.`);
    } catch (error) {
      console.error('Error al proponer Gestor:', error);
    }

    this.cerrarModal();
  }
}
