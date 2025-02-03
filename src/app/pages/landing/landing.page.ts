import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone:false
})
export class LandingPage {
  slides = [0, 1, 2]; // Índice de las imágenes
  currentIndex: number = 0;
  isOverlayVisible: boolean = false; 

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
}
