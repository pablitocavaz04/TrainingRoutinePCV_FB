import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
//Import necesarias para imagenes
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();
  private db = getFirestore();
  private selectedRole: string | null = null;
  showRoleModal = false;
  availableRoles: string[] = [];
  roleSelectionCallback!: (role: string) => void;

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
      this.availableRoles = roles;
      this.showRoleModal = true; // 🔹 Activamos el modal para seleccionar el rol
      return new Promise((resolve) => {
        this.roleSelectionCallback = (selectedRole) => {
          this.setSelectedRole(selectedRole);
          this.showRoleModal = false;
          resolve();
        };
      });
    } else {
      this.setSelectedRole(roles[0]);
    }
  }

  //Con esta funcion Obtenemos el Rol que ha seleccionado el usuario que tiene mas de 1
  getSelectedRole(): string | null {
    return this.selectedRole;
  }
//Seleccioansmo el rol 
  setSelectedRole(role: string): void {
    this.selectedRole = role;
    localStorage.setItem('selectedRole', role);
  }
//Cargaamos el rol 
  private loadSelectedRole(): void {
    this.selectedRole = localStorage.getItem('selectedRole');
  }

  //Comprobamos si el usuario tiene mas de un rol
  async getUserRoles(userId: string): Promise<string[]> {
    const userDocRef = doc(this.db, "personas", userId);
    const userDocSnap = await getDoc(userDocRef);
  
    if (!userDocSnap.exists()) {
      return [];
    }
  
    const userData = userDocSnap.data();
    return userData['roles'] || [];
  }

  //Subir imagenes
  async uploadProfileImage(userId: string, file: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${userId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await this.updateUserImage(userId, downloadURL);
          resolve(downloadURL);
        }
      );
    });
  }
  

  //Actualizarla
  async updateUserImage(userId: string, imageUrl: string): Promise<void> {
    const userDocRef = doc(this.db, "personas", userId);
    await setDoc(userDocRef, { userImage: imageUrl }, { merge: true });
  }
  
  
  

  
  async logout(): Promise<void> {
    await signOut(this.auth);
    localStorage.removeItem('selectedRole');
    this.router.navigate(['/landing']);
  }
}
