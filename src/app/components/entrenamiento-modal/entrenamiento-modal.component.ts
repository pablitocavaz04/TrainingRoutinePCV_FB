import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-entrenamiento-modal',
  templateUrl: './entrenamiento-modal.component.html',
  styleUrls: ['./entrenamiento-modal.component.scss'],
  standalone:false
})
export class EntrenamientoModalComponent implements OnInit {
  entrenamientoForm!: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.entrenamientoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fechaCaducidad: ['', [Validators.required]],
      capacidadMaxima: [1, [Validators.required, Validators.min(1)]],
      imagen: [''], // La imagen se manejará aparte
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  guardarEntrenamiento() {
    if (this.entrenamientoForm.valid) {
      const nuevoEntrenamiento = this.entrenamientoForm.value;
      this.modalController.dismiss(nuevoEntrenamiento);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.entrenamientoForm.patchValue({ imagen: file });
    }
  }
  
}
