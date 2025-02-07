import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        resolve(!!user); // 🔹 Si hay usuario autenticado, permite el acceso
      }, () => {
        resolve(false);
      });
    });
  }
  
  

  askUserRole(): Promise<string> {
    return new Promise((resolve) => {
      const choice = window.confirm('¿Con qué perfil quieres acceder? (Aceptar: Entrenador, Cancelar: Jugador)');
      resolve(choice ? 'Entrenador' : 'Jugador');
    });
  }
}
