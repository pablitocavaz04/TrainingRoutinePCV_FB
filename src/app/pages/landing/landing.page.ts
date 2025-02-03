import { Component, OnInit } from '@angular/core';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: false
})
export class LandingPage implements OnInit {
  slides = [
    { name: 'sesiones', url: '', loaded: false },
    { name: 'entrenamientos', url: '', loaded: false },
    { name: 'roles', url: '', loaded: false }
  ];
  currentIndex: number = 0;
  isOverlayVisible: boolean = false;
  isLoading: boolean = true;  // Estado de carga

  ngOnInit() {
    this.loadImagesFromFirebase();
  }

  async loadImagesFromFirebase() {
    const storage = getStorage();
    let loadedCount = 0;
  
    for (let slide of this.slides) {
      const imageRef = ref(storage, `images/${slide.name}.jpg`);
  
      // Precargar la imagen antes de asignarla
      const url = await getDownloadURL(imageRef);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        slide.url = url;
        slide.loaded = true;
        loadedCount++;
  
        // Si todas las imágenes han cargado, oculta el spinner después de 1s
        if (loadedCount === this.slides.length) {
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        }
      };
    }
  }
  
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  showOverlay(state: boolean) {
    this.isOverlayVisible = state;
  }

  toggleTextVisibility() {
    this.isOverlayVisible = !this.isOverlayVisible;
  } 

   getOverlayText(name: string): string {
    switch (name) {
      case 'sesiones':
        return 'Descubre y únete a sesiones de entrenamiento personalizadas.';
      case 'entrenamientos':
        return 'Mejora tu rendimiento con entrenamientos diseñados para ti.';
      case 'roles':
        return 'Conviértete en jugador, entrenador o gestor dentro de nuestra plataforma.';
      default:
        return '';
    }
  }
}


