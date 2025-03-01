import { Component, Input, OnInit } from '@angular/core';
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
  @Input() entrenamiento: any | null = null;
  entrenamientoForm!: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenVistaPrevia: string | null = null;
  modoEdicion: boolean = false;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private entrenamientoService: EntrenamientosService
  ) {}

  ngOnInit() {
    this.modoEdicion = !!this.entrenamiento;

    this.entrenamientoForm = this.fb.group({
      nombre: [this.entrenamiento?.nombre || '', [Validators.required, Validators.minLength(3)]],
      descripcion: [this.entrenamiento?.descripcion || '', [Validators.required, Validators.minLength(10)]],
      fechaCaducidad: [this.entrenamiento?.fechaCaducidad || '', [Validators.required]],
      capacidadMaxima: [this.entrenamiento?.capacidadMaxima || 1, [Validators.required, Validators.min(1)]],
      imagen: [''], 
    });

    if (this.entrenamiento?.imagen) {
      this.imagenVistaPrevia = this.entrenamiento.imagen;
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async guardarEntrenamiento() {
    if (this.entrenamientoForm.valid) {
      const entrenamientoData = this.entrenamientoForm.value;
  
      if (this.modoEdicion) {
        await this.entrenamientoService.actualizarEntrenamiento(
          this.entrenamiento.id,
          entrenamientoData,
          this.imagenSeleccionada
        );
      } else {
        await this.entrenamientoService.crearEntrenamiento(
          entrenamientoData,
          this.imagenSeleccionada
        );
      }
  
      this.modalController.dismiss();
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
