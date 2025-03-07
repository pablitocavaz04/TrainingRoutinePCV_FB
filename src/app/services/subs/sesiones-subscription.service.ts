import { Injectable } from '@angular/core';
import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { CollectionChange } from 'src/app/interfaces/collection-subscription.interface';

@Injectable({
  providedIn: 'root'
})
export class SesionesSubscriptionService {
  private db = getFirestore();
  private sesionesSubject = new Subject<CollectionChange<any>>();

  constructor() {}

  // Método para suscribirse a la colección "sesiones"
  subscribe(): Observable<CollectionChange<any>> {
    const sesionesCollection = collection(this.db, 'sesiones');

    // Escuchar cambios en tiempo real en Firestore
    onSnapshot(
      sesionesCollection,
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
          this.sesionesSubject.next(changeData);
        });
      },
      error => {
        console.error('Error en la suscripción a sesiones:', error);
        this.sesionesSubject.error(error);
      }
    );

    return this.sesionesSubject.asObservable();
  }
}
