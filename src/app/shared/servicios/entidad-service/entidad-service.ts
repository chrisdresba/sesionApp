import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, query, where, getDocs, collectionData } from '@angular/fire/firestore';
import { ref, uploadBytes, uploadString, getDownloadURL, Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Pedido } from '../../clases/pedido/pedidos';

@Injectable({ providedIn: 'root' })
export class EntidadService {

  constructor(private firestore: Firestore, private storage: Storage) {}

  async crearPedido(pedido: Pedido, foto?: string) {
    try {
      let fotoUrl = '';

      if (foto) {
        if (foto.startsWith('data:image')) {
          const path = `pedidos/${pedido.uidUsuario}/${Date.now()}.jpg`;
          const storageRef = ref(this.storage, path);
          await uploadString(storageRef, foto, 'data_url');
          fotoUrl = await getDownloadURL(storageRef);
        } else {
          fotoUrl = foto;
        }
      }

      const pedidoId = `${pedido.uidUsuario}_${Date.now()}`;
      const pedidoRef = doc(this.firestore, `pedidos/${pedidoId}`);

      await setDoc(pedidoRef, {
        ...pedido,
        fotoUrl,
        fechaCreacion: new Date(),
      });

      console.log('Pedido guardado con foto:', fotoUrl);
    } catch (error) {
      console.error('Error al crear pedido:', error);
    }
  }


  obtenerPedidosPorDni(dniReceptor: string): Observable<Pedido[]> {
    const pedidosRef = collection(this.firestore, 'pedidos');
    const q = query(pedidosRef, where('dniReceptor', '==', dniReceptor));
    return collectionData(q, { idField: 'id' }) as Observable<Pedido[]>;
  }

  obtenerPedidosPorUsuario(uidUsuario: string): Observable<Pedido[]> {
    const pedidosRef = collection(this.firestore, 'pedidos');
    const q = query(pedidosRef, where('uidUsuario', '==', uidUsuario));
    return collectionData(q, { idField: 'id' }) as Observable<Pedido[]>;
  }
}