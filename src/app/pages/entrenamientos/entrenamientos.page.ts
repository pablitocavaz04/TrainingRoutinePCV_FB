import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { EntrenamientoModalComponent } from 'src/app/components/entrenamiento-modal/entrenamiento-modal.component';
import { EntrenamientosService } from 'src/app/services/entrenamientos.service';
import { EntrenamientosSubscriptionService } from 'src/app/services/entrenamientos-subscription.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { CollectionChange } from 'src/app/interfaces/collection-subscription.interface';

@Component({
  selector: 'app-entrenamientos',
  templateUrl: './entrenamientos.page.html',
  styleUrls: ['./entrenamientos.page.scss'],
  standalone:false
})
export class EntrenamientosPage implements OnInit, OnDestroy {
  entrenamientos: any[] = [];
  userRole: string = '';
  entrenamientosSubscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private entrenamientosService: EntrenamientosService,
    private entrenamientosSubscriptionService: EntrenamientosSubscriptionService,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Obtener el rol del usuario
    this.userRole = this.authService.getSelectedRole() || '';

    // 🔥 Suscribirse a los cambios en tiempo real en la colección "entrenamientos"
    this.entrenamientosSubscription = this.entrenamientosSubscriptionService.subscribe().subscribe((change: CollectionChange<any>) => {
      if (change.type === 'added') {
        this.entrenamientos.push(change.data);
      } else if (change.type === 'modified') {
        this.entrenamientos = this.entrenamientos.map(entrenamiento =>
          entrenamiento.id === change.id ? { ...entrenamiento, ...change.data } : entrenamiento
        );
      } else if (change.type === 'removed') {
        this.entrenamientos = this.entrenamientos.filter(entrenamiento => entrenamiento.id !== change.id);
      }
    });
  }

  ngOnDestroy() {
    // ✅ Cancelar la suscripción cuando se destruya el componente para evitar fugas de memoria
    if (this.entrenamientosSubscription) {
      this.entrenamientosSubscription.unsubscribe();
    }
  }

  // ✅ Método para abrir el modal de creación de entrenamiento
  async openCreateTrainingModal() {
    const modal = await this.modalController.create({
      component: EntrenamientoModalComponent,
    });
    return await modal.present();
  }

  // ✅ Método para abrir el modal de edición de entrenamiento
  async editarEntrenamiento(entrenamiento: any) {
    const modal = await this.modalController.create({
      component: EntrenamientoModalComponent,
      componentProps: { entrenamiento }
    });
    return await modal.present();
  }

  // ✅ Método para eliminar un entrenamiento con confirmación
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

  // ✅ Efectos visuales en tarjetas (Hover 3D)
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
