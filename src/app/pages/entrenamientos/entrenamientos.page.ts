import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { EntrenamientoModalComponent } from 'src/app/components/entrenamiento-modal/entrenamiento-modal.component';
import { EntrenamientosService } from 'src/app/services/entrenamientos.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-entrenamientos',
  templateUrl: './entrenamientos.page.html',
  styleUrls: ['./entrenamientos.page.scss'],
  standalone: false
})
export class EntrenamientosPage implements OnInit {
  entrenamientos: any[] = [];
  userRole: string = '';

  constructor(
    private modalController: ModalController,
    private entrenamientosService: EntrenamientosService,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.userRole = this.authService.getSelectedRole() || '';

    // Cargar los entrenamientos para todos los roles
    this.entrenamientosService.getEntrenamientos((data) => {
      this.entrenamientos = data;
    });
  }

  async openCreateTrainingModal() {
    const modal = await this.modalController.create({
      component: EntrenamientoModalComponent,
    });
    return await modal.present();
  }

  async editarEntrenamiento(entrenamiento: any) {
    const modal = await this.modalController.create({
      component: EntrenamientoModalComponent,
      componentProps: { entrenamiento }
    });
    return await modal.present();
  }

  async eliminarEntrenamiento(entrenamientoId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este entrenamiento?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.entrenamientosService.eliminarEntrenamiento(entrenamientoId);
              console.log("Entrenamiento eliminado correctamente");
            } catch (error) {
              console.error("Error al eliminar el entrenamiento:", error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  handleMouseMove(event: MouseEvent, cardId: string) {
    const card = document.querySelector(`[data-id="${cardId}"]`) as HTMLElement;
    if (!card) return;
  
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
  
    const rotateX = (y / rect.height) * -22; 
    const rotateY = (x / rect.width) * 22;  
  
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
    card.style.transition = 'transform 0.2s ease-out'; 
  }
  
  resetTransform(cardId: string) {
    const card = document.querySelector(`[data-id="${cardId}"]`) as HTMLElement;
    if (card) {
      card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
      card.style.transition = 'transform 0.3s ease-in-out'; 
    }
  }
  
}
