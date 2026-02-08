import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Medicamento } from '../types';

const COLLECTION_NAME = 'medicamentos';

export const medicamentoService = {
  // Criar medicamento
  async create(medicamento: Omit<Medicamento, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...medicamento,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Buscar todos os medicamentos
  async getAll(): Promise<Medicamento[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Medicamento[];
  },

  // Buscar medicamento por ID
  async getById(id: string): Promise<Medicamento | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Medicamento;
    }
    return null;
  },

  // Atualizar medicamento
  async update(id: string, medicamento: Partial<Omit<Medicamento, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...medicamento,
      updatedAt: Timestamp.now(),
    });
  },

  // Deletar medicamento
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
