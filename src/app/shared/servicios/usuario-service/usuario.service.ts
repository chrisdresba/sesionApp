import { Injectable, signal } from '@angular/core';

import { Direccion } from '../../clases/direccion/direccion';
import { doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Usuario } from '../../clases/usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario = signal<Usuario | undefined>(undefined);

  constructor(private firestore: Firestore) {}

  async registrarUsuario(email: string, uid: string) {
    const usuario = new Usuario(email,uid);
    try {
      const userRef =  doc(this.firestore, `usuarios/${uid}`); 
      await setDoc(userRef, { ...usuario });
      console.log('Usuario registrado en Realtime Database');
    } catch (error) {
      console.log('Error al guardar usuario en Realtime Database:', error);
    }
  }

   async obtenerUsuarioPorId(uid: string): Promise<Usuario | undefined> {
    try {
      if (!this.firestore) {
        throw new Error('Firestore no inicializado');
      }

      const userRef = doc(this.firestore, `usuarios/${uid}`);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data() as Usuario;
        this.usuario.set(data);
        
        return data;
      } else {
        console.warn(`No se encontró usuario con UID: ${uid}`);
        return undefined;
      }

    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return undefined;
    }
  }

  async validarUsuario(id: string, dni: string, nombre: string, apellido: string, fecha:string,direccion:Direccion) {
    const userRef = doc(this.firestore, `usuarios/${id}`); 
    try {
      await updateDoc(userRef, {
        estado: true,
        dni,
        nombre,
        apellido,
        fecha,
        direccion: JSON.parse(JSON.stringify(direccion))
      });
      console.log('Usuario validado en Realtime Database');
    } catch (error) {
      console.log('Error al validar usuario en Realtime Database:', error);
    }
  }

  extraerDatos(lectura:string) {
    const datos = lectura.split('@');
    if (datos.length < 8) {
        console.error('La cadena no tiene suficientes datos');
        return null;
    }

    const apellido = datos[1];
    const nombre = datos[2];
    const dni = datos[4];
    const fecha = datos[6]; 

    return { apellido, nombre, dni, fecha };
  }

}