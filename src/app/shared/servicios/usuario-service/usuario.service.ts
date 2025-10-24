import { Injectable } from '@angular/core';
import { getDatabase, ref, set, update, onValue } from 'firebase/database';
import { Observable } from 'rxjs';
import { Usuario } from '../../clases/usuario/usuario';
import { Direccion } from '../../clases/direccion/direccion';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private db = getDatabase(); 

  constructor() {}

  async registrarUsuario(email: string, uid: string) {
    const usuario = new Usuario(email,uid);
    try {
      const userRef = ref(this.db, `usuarios/${uid}`); 
      await set(userRef, usuario); 
      console.log('Usuario registrado en Realtime Database');
    } catch (error) {
      console.log('Error al guardar usuario en Realtime Database:', error);
    }
  }

  obtenerUsuarioPorId(uid: string): Observable<any> {
    const userRef = ref(this.db, `usuarios/${uid}`); 
    return new Observable(observer => {
      onValue(userRef, (item) => {
        const data = item.val(); 
        observer.next(data);
      }, {
        onlyOnce: false 
      });
    });
  }

  async validarUsuario(id: string, dni: string, nombre: string, apellido: string, fecha:string,direccion:Direccion) {
    const userRef = ref(this.db, `usuarios/${id}`); 
    try {
      await update(userRef, {
        estado: true,
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        fecha: fecha,
        direccion: direccion
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