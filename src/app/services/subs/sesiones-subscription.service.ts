import { Injectable } from '@angular/core';
import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData, Unsubscribe } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { CollectionChange } from 'src/app/interfaces/collection-subscription.interface';

@Injectable({
  providedIn: 'root'
})
export class SesionesSubscriptionService {
  private db = getFirestore();
  private sesionesSubject = new Subject<CollectionChange<any>>();
  private unsubscribeFn: Unsubscribe | null = null;

  constructor() {}

  subscribe(): Observable<CollectionChange<any>> {
    if (!this.unsubscribeFn) {
      const sesionesCollection = collection(this.db, 'sesiones');

      this.unsubscribeFn = onSnapshot(
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

            this.sesionesSubject.next(changeData);
          });
        },
        error => {
          console.error('Error en la suscripción a sesiones:', error);
          this.sesionesSubject.error(error);
        }
      );
    }

    return this.sesionesSubject.asObservable();
  }

  unsubscribe() {
    if (this.unsubscribeFn) {
      this.unsubscribeFn(); // Cierra el onSnapshot
      this.unsubscribeFn = null;
    }
  }
}
