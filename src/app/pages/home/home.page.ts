import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { SesionModalComponent } from 'src/app/components/sesion-modal/sesion-modal.component';
import { SesionesService } from 'src/app/services/sesiones.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  userRoles: string[] = [];
  selectedRole: string = '';
  sesiones: any[] = [];

  constructor(private sesionesService: SesionesService, private modalController: ModalController) {}

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDocRef = collection(db, 'personas');
      const userQuery = query(userDocRef, where('userID', '==', user.uid));
      const userDocSnap = await getDocs(userQuery);

      if (!userDocSnap.empty) {
        const userData = userDocSnap.docs[0].data();
        this.userRoles = userData['roles'] || [];
      }

      // Recuperar el rol seleccionado
      this.selectedRole = localStorage.getItem('selectedRole') || this.userRoles[0] || '';

      // Cargar sesiones según el rol del usuario
      await this.cargarSesiones(user.uid);
    }
  }

  async cargarSesiones(userId: string) {
    if (this.selectedRole === 'Gestor') {
      this.sesiones = await this.sesionesService.obtenerTodasLasSesiones();
    } else if (this.selectedRole === 'Entrenador') {
      this.sesiones = await this.sesionesService.obtenerSesionesPorCreador(userId);
    } else if (this.selectedRole === 'Jugador') {
      this.sesiones = await this.sesionesService.obtenerSesionesPorJugador(userId);
    }
  }

  // Método para abrir el modal de creación de sesiones
  async openCreateSesionModal() {
    const modal = await this.modalController.create({
      component: SesionModalComponent,
    });
    return await modal.present();
  }
}
