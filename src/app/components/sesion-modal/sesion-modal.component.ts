import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

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

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.sesionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', Validators.required], // La fecha se almacena en formato YYYY-MM-DD
      entrenamientoId: ['', Validators.required], 
      jugadores: [[], Validators.required],       
      imagen: [''],
      coordenadas: [null, Validators.required],
      estado: ['Activo']
    });
    

    // Cargar entrenamientos y jugadores disponibles
    this.cargarEntrenamientos();
    this.cargarJugadores();
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

  closeModal() {
    this.modalController.dismiss();
  }
}
