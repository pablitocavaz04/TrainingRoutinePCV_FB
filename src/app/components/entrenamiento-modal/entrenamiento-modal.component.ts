import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntrenamientosService } from 'src/app/services/entrenamientos.service';

@Component({
  selector: 'app-entrenamiento-modal',
  templateUrl: './entrenamiento-modal.component.html',
  styleUrls: ['./entrenamiento-modal.component.scss'],
  standalone: false
})
export class EntrenamientoModalComponent implements OnInit {
  @Input() entrenamiento: any;
  entrenamientoForm!: FormGroup;
  imagenVistaPrevia: string | null = null;
  imagenSeleccionada: File | null = null;
  modoEdicion: boolean = false;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private entrenamientosService: EntrenamientosService
  ) {}

  ngOnInit() {
    this.modoEdicion = !!this.entrenamiento; // Verifica si hay un entrenamiento pasado por `@Input()`
    
    this.entrenamientoForm = this.fb.group({
      nombre: [this.entrenamiento?.nombre || '', [Validators.required, Validators.minLength(3)]],
      descripcion: [this.entrenamiento?.descripcion || '', Validators.required],
      fechaCaducidad: [this.entrenamiento?.fechaCaducidad || '', Validators.required],
      capacidadMaxima: [this.entrenamiento?.capacidadMaxima || 1, [Validators.required, Validators.min(1)]]
    });

    if (this.entrenamiento?.imagen) {
      this.imagenVistaPrevia = this.entrenamiento.imagen;
    }
  }

  async guardarEntrenamiento() {
    if (!this.entrenamientoForm.valid) {
      console.error("El formulario no es válido");
      return;
    }

    const entrenamientoData = this.entrenamientoForm.value;
    console.log("Guardando entrenamiento:", entrenamientoData);

    try {
      if (this.modoEdicion) {
        await this.entrenamientosService.actualizarEntrenamiento(this.entrenamiento.id, entrenamientoData, this.imagenSeleccionada);
        console.log("Entrenamiento actualizado correctamente");
      } else {
        await this.entrenamientosService.crearEntrenamiento(entrenamientoData, this.imagenSeleccionada);
        console.log("Entrenamiento creado correctamente");
      }

      this.modalController.dismiss({ actualizado: true });
    } catch (error) {
      console.error("Error al guardar el entrenamiento:", error);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenVistaPrevia = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.onFileSelected({ target: { files: event.dataTransfer.files } });
    }
  }
}
