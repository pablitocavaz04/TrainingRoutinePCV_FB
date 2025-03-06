import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment';

// Lottie
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

// Componentes
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { ChangeProfileComponent } from './components/change-profile/change-profile.component';
import { AcceptGestorModalComponent } from './components/accept-gestor-modal/accept-gestor-modal.component';
import { EntrenamientoModalComponent } from './components/entrenamiento-modal/entrenamiento-modal.component';
import { SesionModalComponent } from './components/sesion-modal/sesion-modal.component';
import { JugadorSelectorComponent } from './components/jugador-selector/jugador-selector.component';

// Formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Traducción (ngx-translate)
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Función de carga de traducciones
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProfileModalComponent,
    ChangeProfileComponent,
    AcceptGestorModalComponent,
    EntrenamientoModalComponent,
    SesionModalComponent,
    JugadorSelectorComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule, // Necesario para cargar traducciones
    TranslateModule.forRoot({ // Configuración de ngx-translate
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideLottieOptions({
      player: () => player,
    })
  ],
  bootstrap: [AppComponent],
  exports: [
    NavBarComponent,
    ProfileModalComponent,
    ChangeProfileComponent,
    JugadorSelectorComponent
  ]
})
export class AppModule {
  constructor() {
    initializeApp(environment.firebaseConfig); // Inicializamos Firebase
  }
}
