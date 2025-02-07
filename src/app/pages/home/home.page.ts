import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  userRoles: string[] = [];
  selectedRole: string = '';

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, 'personas', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        this.userRoles = userDocSnap.data()['roles'] || [];
      }

      // Recuperar el rol seleccionado
      this.selectedRole = localStorage.getItem('selectedRole') || this.userRoles[0] || '';
    }
  }
}
