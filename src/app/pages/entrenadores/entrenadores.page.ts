import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-entrenadores',
  templateUrl: './entrenadores.page.html',
  styleUrls: ['./entrenadores.page.scss'],
  standalone: false
})
export class EntrenadoresPage implements OnInit {
  entrenadores: any[] = [];
  userRole: string = '';
  mostrarModal: boolean = false; 
  entrenadorSeleccionado: string = '';

  constructor(private authService: AuthService, private alertController : AlertController) {}

  async ngOnInit() {
    this.userRole = this.authService.getSelectedRole() || '';

    await this.getEntrenadores();
  }

  async getEntrenadores() {
    const db = getFirestore();
    const personasRef = collection(db, 'personas');
    const entrenadoresQuery = query(personasRef, where('roles', 'array-contains', 'Entrenador'));
  
    const querySnapshot = await getDocs(entrenadoresQuery);
    this.entrenadores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      userEmail: doc.data()['userEmail'] || "Correo no disponible",
      userImage: doc.data()['userImage'] || 'assets/default-avatar.png'
    }));
  }

  async confirmarEliminarEntrenador(entrenadorId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres eliminar este entrenador?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => console.log('Eliminación cancelada')
        },
        {
          text: 'Sí, eliminar',
          handler: () => this.deleteEntrenador(entrenadorId)
        }
      ]
    });

    await alert.present();
  }

  async deleteEntrenador(entrenadorId: string) {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "personas", entrenadorId));

      //Actualizamos despues de eliminar
      this.entrenadores = this.entrenadores.filter(entrenador => entrenador.id !== entrenadorId);

    } catch (error) {
      console.error("Error al eliminar el entrenador:", error);
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
  abrirModal(entrenadorId: string) {
    this.entrenadorSeleccionado = entrenadorId;
    this.mostrarModal = true;
  }
  
  cerrarModal() {
    this.mostrarModal = false;
  }
}
