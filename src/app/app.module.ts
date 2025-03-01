import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment';
//Lottie
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
//Componentes
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { ChangeProfileComponent } from './components/change-profile/change-profile.component';
import { AcceptGestorModalComponent } from './components/accept-gestor-modal/accept-gestor-modal.component';
import { EntrenamientoModalComponent } from './components/entrenamiento-modal/entrenamiento-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProfileModalComponent,
    ChangeProfileComponent,
    AcceptGestorModalComponent,
    EntrenamientoModalComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideLottieOptions({
        player: () => player,
      })
    ],
  bootstrap: [AppComponent],
  exports: [
    NavBarComponent,
    ProfileModalComponent,
    ChangeProfileComponent
  ]
})
export class AppModule {
  constructor() {
    initializeApp(environment.firebaseConfig);//Inicializamos base a mano.
  }
}
