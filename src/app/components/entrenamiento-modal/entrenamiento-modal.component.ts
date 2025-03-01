import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntrenamientosService } from 'src/app/services/entrenamientos.service';

@Component({
  selector: 'app-entrenamiento-modal',
  templateUrl: './entrenamiento-modal.component.html',
  styleUrls: ['./entrenamiento-modal.component.scss'],
  standalone:false
})
export class EntrenamientoModalComponent implements OnInit {
  entrenamientoForm!: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenVistaPrevia: string | null = null;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private entrenamientoService: EntrenamientosService
  ) {}

  ngOnInit() {
    this.entrenamientoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fechaCaducidad: ['', [Validators.required]],
      capacidadMaxima: [1, [Validators.required, Validators.min(1)]],
      imagen: [''], // Se actualizará con Drag & Drop
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async guardarEntrenamiento() {
    if (this.entrenamientoForm.valid) {
      try {
        await this.entrenamientoService.crearEntrenamiento(
          this.entrenamientoForm.value,
          this.imagenSeleccionada
        );
        this.modalController.dismiss();
      } catch (error) {
        console.error("Error al guardar el entrenamiento:", error);
      }
    }
  }
  // 🎯 Función para manejar el arrastre del archivo
  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  // 🎯 Función para manejar la selección manual del archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  // 🎯 Función centralizada para manejar el archivo
  handleFile(file: File) {
    this.imagenSeleccionada = file;
    this.entrenamientoForm.patchValue({ imagen: file });

    // Crear vista previa
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagenVistaPrevia = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // 🎯 Evitar que el navegador abra el archivo al arrastrarlo
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}
