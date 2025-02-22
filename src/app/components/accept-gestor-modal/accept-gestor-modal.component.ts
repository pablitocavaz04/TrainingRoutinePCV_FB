import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accept-gestor-modal',
  templateUrl: './accept-gestor-modal.component.html',
  styleUrls: ['./accept-gestor-modal.component.scss'],
  standalone: false
})
export class AcceptGestorModalComponent {
  @Input() entrenadorId: string = ''; // Recibe el ID del entrenador
  @Output() closeModal = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  cerrarModal() {
    this.closeModal.emit();
  }

  async aceptarSolicitud() {
    if (!this.entrenadorId) return;

    try {
      const db = getFirestore();
      const entrenadorRef = doc(db, 'personas', this.entrenadorId);

      await updateDoc(entrenadorRef, {
        roles: ['Gestor'],
        pendingGestorRequest: false
      });


      this.authService.setSelectedRole('Gestor');

      this.router.navigate(['/home']).then(() => {
        window.location.reload(); 
      });

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

      await updateDoc(entrenadorRef, { pendingGestorRequest: false });

    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }

    this.cerrarModal();
  }
}
