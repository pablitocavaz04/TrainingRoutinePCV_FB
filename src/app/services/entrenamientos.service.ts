import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, query, onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class EntrenamientosService {
  private db = getFirestore();
  private entrenamientosCollection = collection(this.db, 'entrenamientos');

  constructor() {}

  async subirImagen(file: File): Promise<string> {
    const storage = getStorage();
    const filePath = `uploads/${file.name}`; // Guardamos en la carpeta 'uploads/'
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async crearEntrenamiento(entrenamiento: any, imagen: File | null) {
    let imagenURL = '';
    if (imagen) {
      imagenURL = await this.subirImagen(imagen);
    }

    const nuevoEntrenamiento = {
      ...entrenamiento,
      imagen: imagenURL,
    };

    return addDoc(this.entrenamientosCollection, nuevoEntrenamiento);
  }

  getEntrenamientos(callback: (entrenamientos: any[]) => void) {
    const q = query(this.entrenamientosCollection);
    
    onSnapshot(q, (snapshot) => {
      const entrenamientos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(entrenamientos);
    });
  }
}
