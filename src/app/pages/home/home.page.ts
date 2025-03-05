import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
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

  constructor(
    private sesionesService: SesionesService, 
    private modalController: ModalController,
    private alertController: AlertController,
  ) {}

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
    let sesionesBase: any[] = [];
  
    if (this.selectedRole === 'Gestor') {
      sesionesBase = await this.sesionesService.obtenerTodasLasSesiones();
    } else if (this.selectedRole === 'Entrenador') {
      sesionesBase = await this.sesionesService.obtenerSesionesPorCreador(userId);
    } else if (this.selectedRole === 'Jugador') {
      sesionesBase = await this.sesionesService.obtenerSesionesPorJugador(userId);
    }
  
    const db = getFirestore();
  
    for (const sesion of sesionesBase) {
      // Obtenemo el nombre del entrenamiento
      if (sesion.entrenamientoId) {
        const entrenamientoRef = collection(db, 'entrenamientos');
        const q = query(entrenamientoRef, where('__name__', '==', sesion.entrenamientoId));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          sesion.entrenamientoNombre = querySnapshot.docs[0].data()['nombre'];
        } else {
          sesion.entrenamientoNombre = 'Desconocido';
        }
      }
  
      //Obtenemos el correo del entrenador
      if (sesion.creadorId) {
        const entrenadoresRef = collection(db, 'personas');
        const q = query(entrenadoresRef, where('userID', '==', sesion.creadorId));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          sesion.entrenadorEmail = querySnapshot.docs[0].data()['userEmail'];
        } else {
          sesion.entrenadorEmail = 'No disponible';
        }
      }
    }
  
    this.sesiones = sesionesBase;
  }
  
  async openCreateSesionModal() {
    const modal = await this.modalController.create({
      component: SesionModalComponent,
    });
    return await modal.present();
  }

  voltearCard(sesion: any) {
    sesion.volteada = !sesion.volteada;

    if (sesion.volteada) {
      setTimeout(() => this.cargarMapaSesion(sesion.id, sesion.coordenadas), 300);
    }
  }

  cargarMapaSesion(sesionId: string, coordenadas: { lat: number, lng: number }) {
    setTimeout(() => {
      const mapElement = document.getElementById(`mapa-${sesionId}`) as HTMLElement;

      if (!mapElement) {
        console.error(`Mapa no encontrado para sesión ${sesionId}`);
        return;
      }

      console.log(`Inicializando mapa para sesión ${sesionId}`);

      mapElement.style.height = "100%";
      mapElement.style.width = "100%";

      const mapa = new google.maps.Map(mapElement, {
        center: coordenadas,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      new google.maps.Marker({
        position: coordenadas,
        map: mapa,
        title: "Ubicación de la Sesión"
      });

    }, 500); //Damos tiemppo al DOM
  }

  //Eliminar la sesion
  async eliminarSesion(sesion: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar la sesión "${sesion.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Sí, eliminar',
          handler: async () => {
            try {
              const db = getFirestore();
              const sesionRef = doc(db, 'sesiones', sesion.id);
  
              await deleteDoc(sesionRef);
              this.sesiones = this.sesiones.filter(s => s.id !== sesion.id);
            } catch (error) {
              console.error(" Error al eliminar la sesión:", error);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  

async editarSesion(sesion: any) {
  const modal = await this.modalController.create({
    component: SesionModalComponent,
    componentProps: { sesion }
  });
  return await modal.present();
}

compartirSesion(sesion: any) {
  const url = `${window.location.origin}/sesion/${sesion.id}`;
  if (navigator.share) {
    navigator.share({
      title: `Sesión: ${sesion.nombre}`,
      text: `Únete a la sesión: ${sesion.nombre}, el día ${sesion.fecha}.`,
      url
    }).then(() => console.log('Sesión compartida con éxito'))
      .catch(error => console.error('Error al compartir sesión:', error));
  } else {
    console.warn("La API de compartir no está disponible en este navegador.");
  }
}


}
