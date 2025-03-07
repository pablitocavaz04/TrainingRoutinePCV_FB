import { Injectable } from '@angular/core';
import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { CollectionChange } from '../interfaces/collection-subscription.interface';

@Injectable({
  providedIn: 'root'
})
export class EntrenamientosSubscriptionService {
  private db = getFirestore();
  private entrenamientosSubject = new Subject<CollectionChange<any>>();

  constructor() {}

  // Método para suscribirse a la colección "entrenamientos"
  subscribe(): Observable<CollectionChange<any>> {
    const entrenamientosCollection = collection(this.db, 'entrenamientos');

    // Escuchar cambios en tiempo real en Firestore
    onSnapshot(
      entrenamientosCollection,
      (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.docChanges().forEach(change => {
          const changeData: CollectionChange<any> = {
            type: change.type as 'added' | 'modified' | 'removed',
            id: change.doc.id
          };

          if (change.type !== 'removed') {
            changeData.data = { id: change.doc.id, ...change.doc.data() };
          }

          // Emitir los cambios a los suscriptores
          this.entrenamientosSubject.next(changeData);
        });
      },
      error => {
        console.error('Error en la suscripción a entrenamientos:', error);
        this.entrenamientosSubject.error(error);
      }
    );

    return this.entrenamientosSubject.asObservable();
  }
}
