Okey esta version trae y ocupa mantenimiento SOLO PARA EL WEB 
Necesito cambios como traduccion agregados etc.
Esto es para josue SOLO ES WEB LA SIGUIENTE ACTUALIZACION NO SE SUBE ES UN PULL BAJALA.

Si se esta clonando el repositorio por primer vez se hace un:

ejemplo


npm install

Para probar la web es usa:

ng serve

TRIUNFO EL MAL!!!!!!!!

Para retrodecer un cambio lanzado usar el comando

"git reset --hard HEAD~1"

Actualizar la version android

"npx cap sync android"


Usando para alertas SweetAlert2

 Configuración de Firebase para Capacitor

Cuando usas Firebase Authentication con Google en una aplicación móvil, debes asegurarte de que la configuración en Firebase sea correcta para las plataformas móviles (iOS/Android). Capacitor necesita un plugin para manejar la autenticación de Google.

Pasos a seguir:
Agregar Firebase SDK: Asegúrate de que tienes el SDK de Firebase configurado para trabajar con Capacitor. Si no lo has hecho, puedes seguir las instrucciones en la documentación oficial.

Integrar el Plugin de Capacitor para Google SignIn: Firebase no tiene un SDK nativo para Google SignIn en móvil, por lo que necesitarás integrar un plugin adicional para Google SignIn. Un plugin común para esto es capacitor-google-auth, que es compatible con Capacitor. Aquí tienes un ejemplo de instalación:

bash
Copiar
Editar
npm install capacitor-google-auth
npx cap sync


Hola Soy josue sin querer lo desplegue en firebase lo voy a eliminar ya que usamos vercel
