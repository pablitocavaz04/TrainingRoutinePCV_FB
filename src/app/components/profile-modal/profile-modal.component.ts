import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent {
  @Input() isOpen: boolean = false;
  @Input() userName: string = "Nombre de Usuario";
  @Input() userEmail: string = "usuario@email.com";
  @Input() userImage: string = "https://via.placeholder.com/100";

  closeModal() {
    this.isOpen = false;
  }
}

/*
Simplemente he creado este modal ahora te indicaré que quiero que contenga, debe contener, en primer lugar, quizá en un thumbnail , o algo parecido , debe aparecer la imagen del usuario en un marco circular, en segundo lugar el correo electrónico, en tercer lugar un botón para cerrar sesion. Cuando estemos en dispositios moviles, y aparezca el sheet, la imagen del usuario, quiero que se desplaze más arriba del final de sheet, quiza puede lograrse tal y que el div de nuestro modal llegue hasta la mitad de la pantalla, el sheet no llegue hasta el final del div, y el marco de la imagen del usuario , que aparezca la mitad dentro del sheet y la otra mitad fuera, si lo has entendido comaprteme el codigo , y luego , haremos que se aparezca este modal al presionar el boton. */
