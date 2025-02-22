import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntrenadoresPageRoutingModule } from './entrenadores-routing.module';

import { EntrenadoresPage } from './entrenadores.page';
import { EditTrainerComponent } from 'src/app/components/edit-trainer/edit-trainer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntrenadoresPageRoutingModule
  ],
  declarations: [EntrenadoresPage, EditTrainerComponent]
})
export class EntrenadoresPageModule {}
