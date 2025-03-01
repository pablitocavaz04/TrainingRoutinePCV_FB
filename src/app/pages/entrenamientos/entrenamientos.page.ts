import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
    private entrenamientosService: EntrenamientosService
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
  
  eliminarEntrenamiento(entrenamientoId: string) {
    console.log("Eliminar entrenamiento con ID:", entrenamientoId);
  }
  
}
