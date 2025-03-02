import { Component, ElementRef, Input, OnInit, ViewChild, HostListener } from '@angular/core';
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
  @Input() entrenamiento: any | null = null;
  entrenamientoForm!: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenVistaPrevia: string | null = null;
  modoEdicion: boolean = false;
  isDesktop: boolean = window.innerWidth > 1024; // Detecta si es escritorio

  @ViewChild('fechaPicker', { static: false }) fechaPicker!: ElementRef;

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

    this.detectScreenSize(); // Detectar tamaño de pantalla al iniciar
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

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    this.imagenSeleccionada = file;
    this.entrenamientoForm.patchValue({ imagen: file });

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagenVistaPrevia = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Detectar si la pantalla es escritorio o móvil
  @HostListener('window:resize', ['$event'])
  detectScreenSize() {
    this.isDesktop = window.innerWidth > 1024; // Si es mayor a 1024px, es escritorio
  }
}
