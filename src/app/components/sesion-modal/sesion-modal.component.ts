import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-sesion-modal',
  templateUrl: './sesion-modal.component.html',
  styleUrls: ['./sesion-modal.component.scss'],
  standalone: false // IMPORTANTE
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
      // Aquí se implementará la lógica para guardar la sesión en Firestore
      console.log("Sesión guardada:", this.sesionForm.value);
      this.modalController.dismiss();
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
