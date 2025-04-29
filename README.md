# **TrainingRoutinePCV** 🚀  

## 📌 **Descripción del Proyecto**  

TrainingRoutinePCV es una aplicación desarrollada en **Ionic/Angular** con integración de **Firebase** para la gestión de entrenamientos y sesiones deportivas. La app permite gestionar usuarios con diferentes roles:  

- **Gestor**: Administra jugadores, entrenadores y entrenamientos.  
- **Entrenador**: Gestiona sesiones y jugadores.  
- **Jugador**: Puede ver sus sesiones asignadas y recibir notificaciones.  

### 🔹 **Características principales:**  
✅ **Autenticación con Firebase** (Email/Password)  
✅ **Auto-login** con Firebase Auth y Firestore  
✅ **Roles dinámicos** con Firestore (`Gestor`, `Entrenador`, `Jugador`)  
✅ **Gestión de entrenamientos y sesiones** en Firebase Firestore  
✅ **Capacitor Plugins:**  
   - 📍 **Geolocalización**: Mostrar ubicación en mapa y verificar proximidad a sesiones  
   - 📸 **Cámara y galería**: Subir imágenes para entrenamientos y sesiones  
   - 📤 **Compartir sesiones** en redes sociales  
✅ **Traducción con ngx-translate** (`en`, `es`)  
✅ **Notificaciones push** (Próximamente con Firebase Cloud Messaging)  

---

## 🚀 **Tecnologías Utilizadas**  

### **Frontend:**  
🔹 **Ionic 7 + Angular 16**  
🔹 **Tailwind CSS** (para un diseño moderno y responsive)  

### **Backend & Base de Datos:**  
🔹 **Firebase Firestore** (Base de datos en tiempo real)  
🔹 **Firebase Storage** (Para almacenar imágenes)  
🔹 **Firebase Authentication** (Manejo de sesiones de usuario)  

### **Capacitor Plugins** (Integración con funcionalidades nativas)  
🔹 **@capacitor/share** → Compartir sesiones en redes sociales  
🔹 **@capacitor/camera** → Tomar fotos o seleccionar imágenes  
🔹 **@capacitor/geolocation** → Localización de sesiones en mapas  
🔹 **@angular/fire** → Conexión con Firebase  

---

## 📂 **Estructura del Proyecto**  

```
TrainingRoutinePCV/
│── src/
│   ├── app/
│   │   ├── pages/          # Páginas principales de la app
│   │   ├── components/     # Componentes reutilizables (modales, selectores, etc.)
│   │   ├── services/       # Servicios para comunicación con Firebase
│   │   ├── guards/         # Guardas de autenticación y autorización
│   │   ├── pipes/          # Pipes para transformación de datos
│   │   ├── app.module.ts   # Módulo principal de la app
│   ├── assets/             # Recursos estáticos (icons, imágenes)
│   ├── environments/       # Configuración de entornos (Firebase)
│   ├── global.scss         # Estilos globales con Tailwind
│   └── main.ts             # Punto de entrada de la aplicación
```

---

## ⚙️ **Instalación y Configuración**  

### **1⃣ Clonar el repositorio**  

```sh
git clone https://github.com/pablitocavaz04/TrainingRoutinePCV.git
cd TrainingRoutinePCV
```

### **2⃣ Instalar dependencias**  

```sh
npm install
```

### **3⃣ Configurar Firebase**  

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).  
2. Activa **Authentication** (Email/Password).  
3. Configura **Firestore Database** en modo de prueba.  
4. Activa **Storage** y define reglas de seguridad.  
5. Descarga el archivo `google-services.json` (Android) o `GoogleService-Info.plist` (iOS) y colócalo en:  

   ```
   android/app/ (para Android)
   ios/App/ (para iOS)
   ```

6. Agrega la configuración en `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
  }
};
```

---

### **4⃣ Ejecutar la aplicación**  

Para desarrollo:  

```sh
ionic serve
```

Para compilar y probar en dispositivos móviles:  

```sh
ionic capacitor build android
ionic capacitor build ios
```

---

## 📧 **Contacto**  

📌 **Pablo Camino Vázquez**  

- **GitHub:** [pablitocavaz04](https://github.com/pablitocavaz04)  
- **Email:** [pablocavaz2004@gmail.com](mailto:pablocavaz2004@gmail.com)  

---

### 🚀 **Hecho con ❤️ y código por Pablo Camino Vázquez**  

---

