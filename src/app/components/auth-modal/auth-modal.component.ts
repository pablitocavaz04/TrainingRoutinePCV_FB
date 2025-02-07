import { Component, Input, Output, EventEmitter } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
  errorMessage = ''; // Variable para mostrar errores en la UI
  isLoading = false; // Estado de carga para deshabilitar el botón mientras procesa

  closeModal() {
    this.close.emit();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // Limpiar errores al cambiar de modo
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

      this.closeModal();
    } catch (error: any) {
      console.error("Error en el registro:", error);
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async login() {
    // Implementaremos esta función en el siguiente paso.
  }
}
