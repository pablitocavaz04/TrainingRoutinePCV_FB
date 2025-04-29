import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutMePageRoutingModule } from './about-me-routing.module';

import { AboutMePage } from './about-me.page';
import { MemoryGameComponent } from 'src/app/components/memory-game/memory-game.component';
import { SnakeGameComponent } from 'src/app/components/snake-game/snake-game.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutMePageRoutingModule
  ],
  declarations: [AboutMePage,MemoryGameComponent,SnakeGameComponent]
})
export class AboutMePageModule {}
