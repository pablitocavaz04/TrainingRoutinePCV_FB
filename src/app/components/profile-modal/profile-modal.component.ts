import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false
})
export class ProfileModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  modalState: 'open' | 'closed' = 'closed';
  userEmail: string = "Cargando...";
  userRole: string = "Cargando...";
  userImage: string = "assets/default-avatar.png";
  canSwitchRole: boolean = false; 
  isConfirmModalOpen: boolean = false; 
  isLoading: boolean = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        this.userEmail = user.email || "Correo no disponible";
        this.userRole = this.authService.getSelectedRole() || "Rol no disponible";

        //Obtenemos la imagen del perfil
        const userDocRef = doc(getFirestore(), "personas", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          this.userImage = userData['userImage'] || "assets/default-avatar.png"; 
        }

        //Obtenemos los roles del usuario
        const roles = await this.authService.getUserRoles(user.uid);
        this.canSwitchRole = roles.includes('Jugador') && roles.includes('Entrenador');
      }
    });
  }

  confirmRoleChange() {
    this.isConfirmModalOpen = true; 
  }

  switchRole() {
    const currentRole = this.authService.getSelectedRole();
    if (!currentRole) return;

    const newRole = currentRole === 'Jugador' ? 'Entrenador' : 'Jugador'; 
    this.authService.setSelectedRole(newRole);
    this.userRole = newRole; 
    this.isConfirmModalOpen = false;
    this.closeModal();
    window.location.reload();
  }

  //Abrimos el explorardor de archivos
  triggerFileInput() {
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  }
  
  //Subir Imagen a Firebase Storage y actualizar Firestore
  async uploadImage(event: any) {
    const file = event.target.files[0]; 
    if (!file) return;
  
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      console.error("Usuario no autenticado.");
      return;
    }
  
    try {
      this.isLoading = true;
      const imageUrl = await this.authService.uploadProfileImage(userId, file);
      this.userImage = imageUrl; //Actualizamos la imagen en UI
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      this.isLoading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["isOpen"]) {
      if (this.isOpen) {
        setTimeout(() => {
          this.modalState = 'open';
        }, 10);
      } else {
        this.modalState = 'closed';
      }
    }
  }

  closeModal() {
    this.modalState = 'closed';
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  async logout() {
    await this.authService.logout();
    this.closeModal();
  }
}
