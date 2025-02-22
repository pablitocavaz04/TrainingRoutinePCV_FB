import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-trainer',
  templateUrl: './edit-trainer.component.html',
  styleUrls: ['./edit-trainer.component.scss'],
  standalone: false
})
export class EditTrainerComponent {
  @Input() entrenadorId: string = '';
  @Output() closeModal = new EventEmitter<void>();

  constructor(private alertController: AlertController) {}

  cerrarModal() {
    this.closeModal.emit();
  }

  async convertirEnJugador() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);

      await updateDoc(entrenadorRef, { roles: ['Jugador'] });

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
      }
    } catch (error) {
      console.error('Error al añadir Jugador:', error);
    }

    this.cerrarModal();
  }

  async confirmarProponerGestor() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres proponer a este Entrenador como Gestor?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => console.log('Solicitud cancelada')
        },
        {
          text: 'Sí, confirmar',
          handler: () => this.proponerGestor()
        }
      ]
    });

    await alert.present();
  }

  async proponerGestor() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);

      await updateDoc(entrenadorRef, { pendingGestorRequest: true });

    } catch (error) {
      console.error('Error al proponer Gestor:', error);
    }

    this.cerrarModal();
  }
}
