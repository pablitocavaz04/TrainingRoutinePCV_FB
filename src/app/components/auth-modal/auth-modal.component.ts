import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  standalone: false
})
export class AuthModalComponent {
  @Input() isLoginMode = true;
  @Output() close = new EventEmitter<void>();

  showPassword = false;
  showConfirmPassword = false;

  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = ''; 
  isLoading = false;

  constructor(private router: Router) {}
  
  closeModal() {
    this.close.emit();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // Limpiar errores cuando cambiamos de modo
  }

  async register() {
    this.errorMessage = '';
    if (!this.email.includes("@") || !this.email.includes(".")) {
      this.errorMessage = "El formato del correo electrónico es inválido.";
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Las contraseñas no coinciden.";
      return;
    }
  
    this.isLoading = true;
    const auth = getAuth();
    const db = getFirestore();
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, this.email.trim(), this.password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "personas", user.uid), {
        userID: user.uid,
        userImage: "",
        roles: ["Jugador"]
      });
  
      // Cambiar al modo de inicio de sesión después de registrarse
      this.isLoginMode = true;
      this.errorMessage = "Registro exitoso. Ahora puedes iniciar sesión.";
    } catch (error: any) {
      console.error("Error en el registro:", error);
      this.errorMessage = "Error al registrar: " + error.message;
    } finally {
      this.isLoading = false;
    }
  }
  
  async login() {
    this.errorMessage = '';
    if (!this.email.includes("@") || !this.email.includes(".")) {
      this.errorMessage = "El formato del correo electrónico es inválido.";
      return;
    }
  
    this.isLoading = true;
    const auth = getAuth();
    const db = getFirestore();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, this.email.trim(), this.password);
      const user = userCredential.user;
  
      // Obtener datos del usuario en Firestore
      const userDocRef = doc(db, "personas", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        throw new Error("No se encontró el usuario en la base de datos.");
      }
  
      const userData = userDocSnap.data();
      const roles: string[] = userData['roles'] || [];
  
      // 🔹 Si el usuario tiene más de un rol, mostrar alert para elegir
      let selectedRole = roles[0]; // Por defecto, el primer rol
  
      if (roles.includes('Jugador') && roles.includes('Entrenador')) {
        selectedRole = await this.askUserRole();
      }
  
      localStorage.setItem('selectedRole', selectedRole); // Guardamos el rol elegido
  
      this.closeModal(); // Cierra el modal después del login
      this.router.navigate(['/home']); // Redirigir a Home
    } catch (error: any) {
      console.error("Error en el inicio de sesión:", error);
      this.errorMessage = "Error al iniciar sesión: " + error.message;
    } finally {
      this.isLoading = false;
    }
  }
  
  // Método para preguntar el rol con un Alert
  askUserRole(): Promise<string> {
    return new Promise((resolve) => {
      const choice = window.confirm('¿Con qué perfil quieres acceder? (Aceptar: Entrenador, Cancelar: Jugador)');
      resolve(choice ? 'Entrenador' : 'Jugador');
    });
  }
  
}
