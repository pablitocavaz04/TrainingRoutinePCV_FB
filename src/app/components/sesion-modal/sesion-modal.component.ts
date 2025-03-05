import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Geolocation } from '@capacitor/geolocation';

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

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.sesionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', Validators.required], 
      entrenamientoId: ['', Validators.required], 
      jugadores: [[], Validators.required],       
      imagen: [''],
      coordenadas: [null, Validators.required],
      estado: ['Activo']
    });

    // Cargar entrenamientos y jugadores disponibles
    this.cargarEntrenamientos();
    this.cargarJugadores();

    // Cargar el mapa sin ion-modal
    this.cargarMapa();
  }

  async cargarEntrenamientos() {
    const db = getFirestore();
    const entrenamientosRef = collection(db, 'entrenamientos');
    const entrenamientosSnapshot = await getDocs(entrenamientosRef);
    this.entrenamientos = entrenamientosSnapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data()['nombre'],
      imagen: doc.data()['imagen'] || 'assets/default-placeholder.png'
    }));
  }

  async cargarJugadores() {
    const db = getFirestore();
    const jugadoresRef = collection(db, 'personas');
    const jugadoresSnapshot = await getDocs(jugadoresRef);
    this.jugadoresDisponibles = jugadoresSnapshot.docs.map(doc => ({
      id: doc.id,
      userEmail: doc.data()['userEmail'] || 'Correo no disponible',
      imagen: doc.data()['userImage'] || 'assets/default-avatar.png'
    }));
  }

  async guardarSesion() {
    if (this.sesionForm.valid) {
      console.log("Sesión guardada:", this.sesionForm.value);
      this.modalController.dismiss();
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
    console.log("🟢 Abriendo el mapa...");
    this.mostrarMapaModal = true;

    // Esperar a que el mapa esté completamente cargado
    setTimeout(() => {
      this.cargarMapa();
    }, 1000);
  }

  // Método corregido para cargar el mapa
  async cargarMapa() {
    try {
      console.log("🟢 Intentando cargar el mapa...");

      const mapElement = document.querySelector("#mapa") as HTMLElement;

      if (!mapElement) {
        console.error("❌ Elemento del mapa no encontrado. Intentando nuevamente...");
        setTimeout(() => this.cargarMapa(), 500); // Reintentar después de 500ms
        return;
      }

      console.log("✅ Elemento del mapa encontrado:", mapElement);

      // Verificar si Google Maps está disponible
      if (typeof google === "undefined" || typeof google.maps === "undefined") {
        console.error("❌ Google Maps no está disponible.");
        return;
      }

      console.log("🟢 Google Maps detectado, inicializando...");

      // Obtener la ubicación actual del usuario
      const ubicacionActual = await Geolocation.getCurrentPosition();
      const lat = ubicacionActual.coords.latitude;
      const lng = ubicacionActual.coords.longitude;

      console.log(`📍 Ubicación actual: ${lat}, ${lng}`);

      // Asegurar que el contenedor del mapa tiene dimensiones antes de inicializarlo
      mapElement.style.height = "60vh";
      mapElement.style.width = "100%";

      // Crear el mapa
      this.mapa = new google.maps.Map(mapElement, {
        center: { lat, lng },
        zoom: 15,
      });

      console.log("✅ Mapa inicializado con éxito.");

      // Agregar marcador
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.mapa,
        draggable: true,
      });

      console.log("📌 Marcador añadido en:", this.marker.getPosition());

      // Evento para actualizar coordenadas cuando se mueva el marcador
      this.marker.addListener("dragend", () => {
        const posicion = this.marker.getPosition();
        this.ubicacionSeleccionada = {
          lat: posicion?.lat() || lat,
          lng: posicion?.lng() || lng,
        };
        console.log("📍 Nueva ubicación seleccionada:", this.ubicacionSeleccionada);
      });

    } catch (error) {
      console.error("Error al cargar el mapa:", error);
    }
  }

  // Función para retraso en la ejecución
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para cerrar el mapa
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
