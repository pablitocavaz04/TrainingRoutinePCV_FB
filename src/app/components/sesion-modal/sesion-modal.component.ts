import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Geolocation } from '@capacitor/geolocation';
import { getAuth } from 'firebase/auth';

declare var google: any;

@Component({
  selector: 'app-sesion-modal',
  templateUrl: './sesion-modal.component.html',
  styleUrls: ['./sesion-modal.component.scss'],
  standalone: false
})
export class SesionModalComponent implements OnInit {
  sesionForm!: FormGroup;
  entrenamientos: any[] = [];
  jugadoresDisponibles: any[] = [];
  modoEdicion: boolean = false;
  mostrarMapaModal = false; 
  mapa: any;
  marker: any;
  ubicacionSeleccionada: { lat: number, lng: number } | null = null;
  errorCapacidad: string = '';// para mostrar el mensaje de capacida maxima 


  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.modoEdicion = this.navParams.get('modoEdicion') || false; 
  
    const sesionData = this.navParams.get('sesion') || {};
  
    this.sesionForm = this.fb.group({
      nombre: [sesionData.nombre || '', [Validators.required, Validators.minLength(3)]],
      fecha: [sesionData.fecha || '', Validators.required],
      entrenamientoId: [sesionData.entrenamientoId || '', Validators.required],
      jugadores: [sesionData.jugadores || [], Validators.required],
      imagen: [sesionData.imagen || ''],
      coordenadas: [sesionData.coordenadas || null, Validators.required],
      estado: [sesionData.estado || 'Activo']
    });
  
    this.cargarEntrenamientos();
    this.cargarJugadores();
  
    if (this.modoEdicion && sesionData.coordenadas) {
      setTimeout(() => this.cargarMapa(sesionData.coordenadas || null), 500);
    } else {
      this.cargarMapa(); 
    }
  }
onJugadoresSeleccionados() {
  const jugadoresSeleccionados = this.sesionForm.value.jugadores.length;
  const capacidadMaxima = this.getCapacidadMaximaEntrenamiento();

  if (jugadoresSeleccionados > capacidadMaxima) {
    this.errorCapacidad = `Número de jugadores superado. El límite es ${capacidadMaxima}.`;
  } else {
    this.errorCapacidad = '';
  }
}

getCapacidadMaximaEntrenamiento(): number {
  const entrenamientoSeleccionado = this.entrenamientos.find(e => e.id === this.sesionForm.value.entrenamientoId);
  return entrenamientoSeleccionado ? entrenamientoSeleccionado.capacidadMaxima : 0;
}



  async cargarEntrenamientos() {
    const db = getFirestore();
    const entrenamientosRef = collection(db, 'entrenamientos');
    const entrenamientosSnapshot = await getDocs(entrenamientosRef);
    this.entrenamientos = entrenamientosSnapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data()['nombre'],
      imagen: doc.data()['imagen'] || 'assets/default-placeholder.png',
      capacidadMaxima: doc.data()['capacidadMaxima'] || 1 
    }));
  }
  

  async cargarJugadores() {
    const db = getFirestore();
    const jugadoresRef = collection(db, 'personas');
    const jugadoresSnapshot = await getDocs(jugadoresRef);
  
    this.jugadoresDisponibles = jugadoresSnapshot.docs
      .map(doc => ({
        id: doc.id,
        userEmail: doc.data()['userEmail'] || 'Correo no disponible',
        imagen: doc.data()['userImage'] || 'assets/default-avatar.png',
        roles: doc.data()['roles'] || [] 
      }))
      .filter(jugador => jugador.roles.includes('Jugador')); 
  }
  async guardarSesion() {
    if (!this.sesionForm.valid) {
        return;
    }

    const sesionData = this.sesionForm.value;
    const entrenamientoSeleccionado = this.entrenamientos.find(e => e.id === sesionData.entrenamientoId);

    if (!entrenamientoSeleccionado) {
        return;
    }

    if (sesionData.jugadores.length > entrenamientoSeleccionado.capacidadMaxima) {
        this.errorCapacidad = `Número de jugadores superado. El límite es ${entrenamientoSeleccionado.capacidadMaxima}.`;
        return;
    } else {
        this.errorCapacidad = ''; 
    }

    try {
        const db = getFirestore();
        const sesionesRef = collection(db, 'sesiones');
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            return;
        }

        // Obtener el email del entrenador
        const entrenadoresRef = collection(db, 'personas');
        const entrenadoresQuery = query(entrenadoresRef, where('userID', '==', user.uid));
        const entrenadoresSnapshot = await getDocs(entrenadoresQuery);
        const entrenadorEmail = !entrenadoresSnapshot.empty ? entrenadoresSnapshot.docs[0].data()['userEmail'] : 'No disponible';

        if (this.modoEdicion) {
            const sesionRef = doc(db, 'sesiones', this.navParams.get('sesion').id);
            await updateDoc(sesionRef, sesionData);
            this.modalController.dismiss({ 
                sesionActualizada: { 
                    id: this.navParams.get('sesion').id, 
                    ...sesionData,
                    entrenamientoNombre: entrenamientoSeleccionado.nombre, // Agregar el nombre del entrenamiento
                    entrenadorEmail: entrenadorEmail // Agregar el email del entrenador
                } 
            });

        } else {
            const nuevaSesion = {
                nombre: sesionData.nombre,
                fecha: sesionData.fecha,
                entrenamientoId: sesionData.entrenamientoId,
                jugadores: sesionData.jugadores,
                imagen: sesionData.imagen || '',
                estado: sesionData.estado,
                coordenadas: sesionData.coordenadas || null,
                creadorId: user.uid,
                timestamp: new Date(),
                entrenamientoNombre: entrenamientoSeleccionado.nombre, // Agregar el nombre del entrenamiento
                entrenadorEmail: entrenadorEmail // Agregar el email del entrenador
            };

            const docRef = await addDoc(sesionesRef, nuevaSesion);
            this.modalController.dismiss({ nuevaSesion: { id: docRef.id, ...nuevaSesion } });
        }

    } catch (error) {
        console.error("Error al guardar la sesión:", error);
    }
}

  // Selección de imagen
  async seleccionarImagen(origen: 'galeria' | 'camara') {
    try {
      const imagen = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: origen === 'camara' ? CameraSource.Camera : CameraSource.Photos
      });

      if (imagen?.webPath) {
        this.sesionForm.patchValue({ imagen: imagen.webPath });
        await this.subirImagenAFirebase(imagen.webPath);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
    }
  }

  async subirImagenAFirebase(imagenWebPath: string) {
    try {
      const response = await fetch(imagenWebPath);
      const blob = await response.blob();

      const storage = getStorage();
      const filePath = `uploads/${new Date().getTime()}.jpg`;
      const storageRef = ref(storage, filePath);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      this.sesionForm.patchValue({ imagen: downloadURL });
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  }

  // Mapa
  async abrirMapa() {
    this.mostrarMapaModal = true;

    setTimeout(() => {
      this.cargarMapa();
    }, 1000);
  }

  async cargarMapa(coordenadas?: { lat: number, lng: number }) {
    try {
        const mapElement = document.querySelector("#mapa") as HTMLElement;

        if (!mapElement) {
            setTimeout(() => this.cargarMapa(coordenadas), 500); 
            return;
        }

        if (typeof google === "undefined" || typeof google.maps === "undefined") {
            return;
        }

        if (!coordenadas) {
            const ubicacionActual = await Geolocation.getCurrentPosition();
            coordenadas = {
                lat: ubicacionActual.coords.latitude,
                lng: ubicacionActual.coords.longitude
            };
        }

        mapElement.style.height = "60vh";
        mapElement.style.width = "100%";

        this.mapa = new google.maps.Map(mapElement, {
            center: coordenadas,
            zoom: 15,
        });

        this.marker = new google.maps.Marker({
            position: coordenadas,
            map: this.mapa,
            draggable: true,
        });

        this.marker.addListener("dragend", () => {
            const posicion = this.marker.getPosition();
            this.ubicacionSeleccionada = {
                lat: posicion?.lat() || coordenadas!.lat,
                lng: posicion?.lng() || coordenadas!.lng,
            };
            this.sesionForm.patchValue({ coordenadas: this.ubicacionSeleccionada });
        });

    } catch (error) {
        console.error("Error al cargar el mapa:", error);
    }
}


    delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    cerrarMapa() {
      this.mostrarMapaModal = false;
    }

  // Guardar ubicación
  guardarUbicacion() {
    if (this.ubicacionSeleccionada) {
      this.sesionForm.patchValue({ coordenadas: this.ubicacionSeleccionada });
    } else {
      console.warn("No se ha seleccionado una ubicación.");
    }
    this.cerrarMapa();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
