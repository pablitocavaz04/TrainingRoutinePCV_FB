import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.page.html',
  styleUrls: ['./jugadores.page.scss'],
  standalone: false
})
export class JugadoresPage implements OnInit {
  jugadores: any[] = [];
  userRole: string = '';

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.userRole = this.authService.getSelectedRole() || '';

    if (this.userRole === 'Jugador') {
      return; //Si el usuario es "Jugador", no carga nada para no sobrecargar la web , además ocultaremos el boton de la barra de navegacion
    }

    await this.getJugadores();
  }

  //Obtenemos los jugadores con sus datos
  async getJugadores() {
    const db = getFirestore();
    const personasRef = collection(db, 'personas');
    const jugadoresQuery = query(personasRef, where('roles', 'array-contains', 'Jugador'));
  
    const querySnapshot = await getDocs(jugadoresQuery);
    this.jugadores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      userEmail: doc.data()['userEmail'] || "Correo no disponible", //Correo que obtenemos de la tabla persona ya que asiganamos el correo al registra al usuario
      userImage: doc.data()['userImage'] || 'assets/default-avatar.png'
    }));
  }
  

  //Mostramos el alert para confirmar
  async deleteJugador(jugadorId: string, userId: string) {
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este jugador?");
    if (!confirmDelete) return;
  
    try {
      const db = getFirestore();
      const auth = getAuth();
  
      //Eliminamos de la tabla
      await deleteDoc(doc(db, "personas", jugadorId));
  
  
      //Aqui vamos a actualizar la liste de los jugadores despues de eliminarlo
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
  
    const rotateX = (y / rect.height) * -10;
    const rotateY = (x / rect.width) * 10;
  
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }
  
  resetTransform(cardId: string) {
    const card = document.querySelector(`[data-id="${cardId}"]`) as HTMLElement;
    if (card) {
      card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
    }
  }
  
}
