import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LandingPageRoutingModule } from './landing-routing.module';
import { LandingPage } from './landing.page';
import { AuthModalComponent } from 'src/app/components/auth-modal/auth-modal.component';
import { PasswordTogglePipe } from 'src/app/pipes/password-toggle.pipe'; // ✅ Importar el Pipe
import { RoleSelectionModalComponent } from 'src/app/components/role-selection-modal/role-selection-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPageRoutingModule,
    PasswordTogglePipe
  ],
  declarations: [
    LandingPage,
    AuthModalComponent,
    RoleSelectionModalComponent
  ]
})
export class LandingPageModule {}
