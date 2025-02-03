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
    { name: 'informacion', url: '', loaded: false, isInfo: true },
    { name: 'sesiones', url: '', loaded: false },
    { name: 'entrenamientos', url: '', loaded: false },
    { name: 'roles', url: '', loaded: false }
  ];
  currentIndex: number = 0;
  isOverlayVisible: boolean = false;
  isLoading: boolean = true;

  ngOnInit() {
    this.loadImagesFromFirebase();
  }

  async loadImagesFromFirebase() {
    const storage = getStorage();
    let loadedCount = 0;

    for (let slide of this.slides) {
      const imageRef = ref(storage, `images/${slide.name}.jpg`);
      
      try {
        const url = await getDownloadURL(imageRef);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          slide.url = url;
          slide.loaded = true;
          loadedCount++;

          if (loadedCount === this.slides.length) {
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
          }
        };
      } catch (error) {
        console.error(`Error cargando ${slide.name}:`, error);
      }
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
