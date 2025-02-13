import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false
})
export class ProfileModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() userImage: string = "https://via.placeholder.com/100";
  @Output() close = new EventEmitter<void>();

  modalState: 'open' | 'closed' = 'closed';
  userEmail: string = "Cargando...";
  userRole: string = "Cargando...";
  canSwitchRole: boolean = false;//Miramos si tenemos que mostrar el boton
  isConfirmModalOpen: boolean = false; //Controlamos la visibilidad del modal de confirmación


  constructor(public authService: AuthService) {}

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        this.userEmail = user.email || "Correo no disponible";
        this.userRole = this.authService.getSelectedRole() || "Rol no disponible";

        //Obtener los roles del usuario desde AuthService
        const roles = await this.authService.getUserRoles(user.uid);
        this.canSwitchRole = roles.includes('Jugador') && roles.includes('Entrenador');
      }
    });
  }

  confirmRoleChange() {
    this.isConfirmModalOpen = true; // 🔹 Mostramos el modal de confirmación
  }

  switchRole() {
    const currentRole = this.authService.getSelectedRole();
    if (!currentRole) return;

    const newRole = currentRole === 'Jugador' ? 'Entrenador' : 'Jugador'; //Cambiar entre Jugador y Entrenador
    this.authService.setSelectedRole(newRole);
    this.userRole = newRole; //Actualizamos el rol en el modal
    this.isConfirmModalOpen = false;
    this.closeModal();
    window.location.reload(); //Recargamos la página para aplicar los cambios
  }


  //IMAGENES
  triggerFileInput() {
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  }
  
  uploadImage(event: any) {
    const file = event.target.files[0]; // 🔹 Obtenemos el archivo seleccionado
    if (!file) return;
  
    console.log("Archivo seleccionado:", file);
  }
  
////////////////////////
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
