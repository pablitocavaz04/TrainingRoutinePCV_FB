import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { SesionModalComponent } from 'src/app/components/sesion-modal/sesion-modal.component';
import { SesionesService } from 'src/app/services/sesiones.service';

declare var google: any;
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


  // Método para voltear la card
  voltearCard(sesion: any) {
    sesion.volteada = !sesion.volteada;

    if (sesion.volteada) {
      setTimeout(() => this.cargarMapaSesion(sesion.id, sesion.coordenadas), 300);
    }
  }

  // Método para cargar el mapa en la parte trasera de la card
  // Método para cargar el mapa en la parte trasera de la card
  cargarMapaSesion(sesionId: string, coordenadas: { lat: number, lng: number }) {
    setTimeout(() => {
      const mapElement = document.getElementById(`mapa-${sesionId}`) as HTMLElement;

      if (!mapElement) {
        console.error(`❌ Mapa no encontrado para sesión ${sesionId}`);
        return;
      }

      console.log(`✅ Inicializando mapa para sesión ${sesionId}`);

      // Asegurar que el contenedor tiene dimensiones antes de inicializar el mapa
      mapElement.style.height = "100%";
      mapElement.style.width = "100%";

      // Crear el mapa
      const mapa = new google.maps.Map(mapElement, {
        center: coordenadas,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // Agregar marcador
      new google.maps.Marker({
        position: coordenadas,
        map: mapa,
        title: "Ubicación de la Sesión"
      });

    }, 500); // 🔹 Aumentamos el retraso para dar tiempo al DOM a renderizar
  }

}
