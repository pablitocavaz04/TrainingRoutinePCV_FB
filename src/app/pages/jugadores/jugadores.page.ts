import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.page.html',
  styleUrls: ['./jugadores.page.scss'],
  standalone:false
})
export class JugadoresPage implements OnInit {
  jugadores: any[] = [];
  userRole: string = '';
  mostrarModal: boolean = false; 

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.userRole = this.authService.getSelectedRole() || '';

    if (this.userRole === 'Jugador') {
      return; 
    }

    await this.getJugadores();
  }

  async getJugadores() {
    const db = getFirestore();
    const personasRef = collection(db, 'personas');
    const jugadoresQuery = query(personasRef, where('roles', 'array-contains', 'Jugador'));
  
    const querySnapshot = await getDocs(jugadoresQuery);
    this.jugadores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      userEmail: doc.data()['userEmail'] || "Correo no disponible",
      userImage: doc.data()['userImage'] || 'assets/default-avatar.png'
    }));
  }

  async deleteJugador(jugadorId: string, userId: string) {
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este jugador?");
    if (!confirmDelete) return;
  
    try {
      const db = getFirestore();
      const auth = getAuth();
  
      await deleteDoc(doc(db, "personas", jugadorId));

      // Actualizamos después de borrar a un jugador 
      this.jugadores = this.jugadores.filter(jugador => jugador.id !== jugadorId);
    } catch (error) {
      console.error("Error al eliminar el jugador:", error);
    }
  }

  handleMouseMove(event: MouseEvent, cardId: string) {
    const card = document.querySelector(`[data-id="${cardId}"]`) as HTMLElement;
    if (!card) return;
  
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
  
    const rotateX = (y / rect.height) * -22; 
    const rotateY = (x / rect.width) * 22;  
  
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
    card.style.transition = 'transform 0.2s ease-out'; 
  }

  resetTransform(cardId: string) {
    const card = document.querySelector(`[data-id="${cardId}"]`) as HTMLElement;
    if (card) {
      card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
      card.style.transition = 'transform 0.3s ease-in-out'; 
    }
  }

  // Métodos para abrir y cerrar el modal
  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
