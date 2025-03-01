import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EntrenamientoModalComponent } from 'src/app/components/entrenamiento-modal/entrenamiento-modal.component';

@Component({
  selector: 'app-entrenamientos',
  templateUrl: './entrenamientos.page.html',
  styleUrls: ['./entrenamientos.page.scss'],
  standalone:false
})
export class EntrenamientosPage {
  constructor(private modalController: ModalController) {}

  async openCreateTrainingModal() {
    const modal = await this.modalController.create({
      component: EntrenamientoModalComponent,
    });
    return await modal.present();
  }
}
