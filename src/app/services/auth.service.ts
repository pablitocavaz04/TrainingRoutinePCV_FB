import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();
  private db = getFirestore();
  private selectedRole: string | null = null;

  constructor(private router: Router) {
    this.loadSelectedRole();
  }

  async register(email: string, password: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email.trim(), password);
    const user = userCredential.user;

    await setDoc(doc(this.db, "personas", user.uid), {
      userID: user.uid,
      userImage: "",
      roles: ["Jugador"]
    });
  }

  async login(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email.trim(), password);
    const user = userCredential.user;
    await this.setUserRole(user);
  }

  async setUserRole(user: User): Promise<void> {
    const userDocRef = doc(this.db, "personas", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error("No se encontró el usuario en la base de datos.");
    }

    const userData = userDocSnap.data();
    const roles: string[] = userData['roles'] || [];

    if (roles.includes('Jugador') && roles.includes('Entrenador')) {
      this.selectedRole = await this.askUserRole();
    } else {
      this.selectedRole = roles[0];
    }

    this.setSelectedRole(this.selectedRole); // 🔹 Ahora usamos el nuevo método para guardar el rol
  }

  getSelectedRole(): string | null {
    return this.selectedRole;
  }

  setSelectedRole(role: string): void { // 🔹 Agregado para evitar el error
    this.selectedRole = role;
    localStorage.setItem('selectedRole', role);
  }

  private loadSelectedRole(): void {
    this.selectedRole = localStorage.getItem('selectedRole');
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    localStorage.removeItem('selectedRole');
    this.router.navigate(['/landing']);
  }

  private askUserRole(): Promise<string> {
    return new Promise((resolve) => {
      const choice = window.confirm('¿Con qué perfil quieres acceder? (Aceptar: Entrenador, Cancelar: Jugador)');
      resolve(choice ? 'Entrenador' : 'Jugador');
    });
  }
}
