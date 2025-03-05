import { Injectable } from '@angular/core';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SesionesService {
  crearSesion(value: any) {
    throw new Error('Method not implemented.');
  }
  private db = getFirestore();
  private sesionesCollection = collection(this.db, 'sesiones');

  constructor() {}

  // Obtener todas las sesiones (para el Gestor)
  async obtenerTodasLasSesiones() {
    const q = query(this.sesionesCollection);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Obtener sesiones creadas por un Entrenador
  async obtenerSesionesPorCreador(userId: string) {
    const q = query(this.sesionesCollection, where('creadorId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Obtener sesiones donde un jugador está asignado
  async obtenerSesionesPorJugador(userId: string) {
    const q = query(this.sesionesCollection, where('jugadores', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
