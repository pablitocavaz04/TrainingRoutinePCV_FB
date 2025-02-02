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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideLottieOptions({
        player: () => player,
      })
    ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    initializeApp(environment.firebaseConfig);//Inicializamos base a mano.
  }
}
