import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JugadoresPageRoutingModule } from './jugadores-routing.module';

import { JugadoresPage } from './jugadores.page';
import { EditRolComponent } from 'src/app/components/edit-rol/edit-rol.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JugadoresPageRoutingModule
  ],
  declarations: [JugadoresPage, EditRolComponent]
})
export class JugadoresPageModule {}
