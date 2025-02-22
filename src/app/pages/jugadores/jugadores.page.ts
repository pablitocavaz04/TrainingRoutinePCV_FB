import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { AlertController } from '@ionic/angular';

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
  jugadorSeleccionado: string = '';

  constructor(private authService: AuthService, private alertController: AlertController) {}

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

  async confirmarEliminarJugador(jugadorId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres eliminar este jugador?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => console.log('Eliminación cancelada')
        },
        {
          text: 'Sí, eliminar',
          handler: () => this.deleteJugador(jugadorId) 
        }
      ]
    });

    await alert.present();
  }

  async deleteJugador(jugadorId: string) {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "personas", jugadorId));

      //ACtualizamos despues de eliminar jugador para que no aparezca
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
  abrirModal(jugadorId: string) {
    this.jugadorSeleccionado = jugadorId;
    this.mostrarModal = true;
  }
  

  cerrarModal() {
    this.mostrarModal = false;
  }
  async updateJugadorRole(tipoCambio: string) {
    if (!this.jugadorSeleccionado) {
      console.log("Error: No hay jugador seleccionado.");
      return;
    }
  
    console.log(`vento recibido en jugadores.page.ts: ${tipoCambio}`);
  
    try {
      const db = getFirestore();
      const jugadorRef = doc(db, "personas", this.jugadorSeleccionado);
  
      // Aqui obtenemos los roles actuales
      const jugadorSnap = await getDoc(jugadorRef);
      if (!jugadorSnap.exists()) {
        console.log(" Error: Jugador no encontrado en Firestore.");
        return;
      }
  
      let roles = jugadorSnap.data()['roles'] || [];
  
      if (tipoCambio === 'convertir') {
        roles = ['Entrenador'];
      } else if (tipoCambio === 'añadir' && !roles.includes('Entrenador')) {
        roles.push('Entrenador');
      }
  
      await updateDoc(jugadorRef, { roles });
  
      console.log(`✅ Rol actualizado en Firestore: ${roles}`);
  
      this.jugadores = this.jugadores.map(jugador =>
        jugador.id === this.jugadorSeleccionado ? { ...jugador, roles } : jugador
      );
  
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  }
  
}
