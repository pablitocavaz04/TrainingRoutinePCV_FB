import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';

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

  async eliminarEntrenamiento(entrenamientoId: string) {
    const entrenamientoRef = doc(this.db, 'entrenamientos', entrenamientoId);
    await deleteDoc(entrenamientoRef);
  }

  async actualizarEntrenamiento(entrenamientoId: string, data: any, nuevaImagen: File | null) {
    const entrenamientoRef = doc(this.db, 'entrenamientos', entrenamientoId);
  
    // Obtener los datos actuales del entrenamiento
    const entrenamientoSnap = await getDoc(entrenamientoRef);
    const entrenamientoActual = entrenamientoSnap.exists() ? entrenamientoSnap.data() : {};
  
    // Si no hay nueva imagen, mantener la imagen anterior
    if (!nuevaImagen) {
      data.imagen = entrenamientoActual['imagen'] || ''; 
    } else {
      data.imagen = await this.subirImagen(nuevaImagen); // Subir nueva imagen
    }
  
    await updateDoc(entrenamientoRef, data);
  }
}
