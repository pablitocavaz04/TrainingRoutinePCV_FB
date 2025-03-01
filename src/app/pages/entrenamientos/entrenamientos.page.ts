import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { EntrenamientoModalComponent } from 'src/app/components/entrenamiento-modal/entrenamiento-modal.component';
import { EntrenamientosService } from 'src/app/services/entrenamientos.service';

@Component({
  selector: 'app-entrenamientos',
  templateUrl: './entrenamientos.page.html',
  styleUrls: ['./entrenamientos.page.scss'],
  standalone: false
})
export class EntrenamientosPage implements OnInit {
  entrenamientos: any[] = [];

  constructor(
    private modalController: ModalController,
    private entrenamientosService: EntrenamientosService,
    private alertController : AlertController
  ) {}

  ngOnInit() {
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

  editarEntrenamiento(entrenamiento: any) {
    console.log("Editar entrenamiento:", entrenamiento);
  }
  
  async eliminarEntrenamiento(entrenamientoId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este entrenamiento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
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
  
}
