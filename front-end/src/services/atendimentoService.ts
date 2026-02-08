import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  getDoc,
  Timestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Atendimento } from '../types';
import { pacienteService } from './pacienteService';

const COLLECTION_NAME = 'atendimentos';

// Função auxiliar para calcular IMC
function calcularIMC(peso?: number, altura?: number): number | undefined {
  if (peso && altura && altura > 0) {
    const alturaMetros = altura / 100; // Converter cm para metros
    return Number((peso / (alturaMetros * alturaMetros)).toFixed(2));
  }
  return undefined;
}

export const atendimentoService = {
  // Criar atendimento
  async create(atendimento: Omit<Atendimento, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Calcular IMC se peso e altura estiverem presentes
    const exameFisico = atendimento.exameFisico ? {
      ...atendimento.exameFisico,
      imc: calcularIMC(atendimento.exameFisico.peso, atendimento.exameFisico.altura),
    } : undefined;

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...atendimento,
      exameFisico,
      data: Timestamp.fromDate(atendimento.data),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Buscar todos os atendimentos com filtros
  async getAll(filters?: {
    dataInicial?: Date;
    dataFinal?: Date;
    pacienteId?: string;
  }): Promise<Atendimento[]> {
    let q = query(collection(db, COLLECTION_NAME), orderBy('data', 'desc'));

    if (filters?.dataInicial) {
      q = query(q, where('data', '>=', Timestamp.fromDate(filters.dataInicial)));
    }

    if (filters?.dataFinal) {
      const dataFinal = new Date(filters.dataFinal);
      dataFinal.setHours(23, 59, 59, 999); // Fim do dia
      q = query(q, where('data', '<=', Timestamp.fromDate(dataFinal)));
    }

    if (filters?.pacienteId) {
      q = query(q, where('pacienteId', '==', filters.pacienteId));
    }

    const querySnapshot = await getDocs(q);
    const atendimentos = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // Buscar dados do paciente
        let paciente = null;
        if (data.pacienteId) {
          paciente = await pacienteService.getById(data.pacienteId);
        }

        return {
          id: doc.id,
          pacienteId: data.pacienteId,
          paciente: paciente || undefined,
          data: data.data?.toDate() || new Date(),
          observacao: data.observacao,
          exameFisico: data.exameFisico,
          medicamentos: data.medicamentos || [],
          exames: data.exames || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Atendimento;
      })
    );

    return atendimentos;
  },

  // Buscar atendimento por ID
  async getById(id: string): Promise<Atendimento | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Buscar dados do paciente
      let paciente = null;
      if (data.pacienteId) {
        paciente = await pacienteService.getById(data.pacienteId);
      }

      return {
        id: docSnap.id,
        pacienteId: data.pacienteId,
        paciente: paciente || undefined,
        data: data.data?.toDate() || new Date(),
        observacao: data.observacao,
        exameFisico: data.exameFisico,
        medicamentos: data.medicamentos || [],
        exames: data.exames || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Atendimento;
    }
    return null;
  },

  // Atualizar atendimento
  async update(id: string, atendimento: Partial<Omit<Atendimento, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Calcular IMC se peso e altura estiverem presentes
    let exameFisico = atendimento.exameFisico;
    if (exameFisico && (exameFisico.peso || exameFisico.altura)) {
      exameFisico = {
        ...exameFisico,
        imc: calcularIMC(exameFisico.peso, exameFisico.altura),
      };
    }

    const updateData: any = {
      ...atendimento,
      updatedAt: Timestamp.now(),
    };

    if (atendimento.data) {
      updateData.data = Timestamp.fromDate(atendimento.data);
    }

    if (exameFisico) {
      updateData.exameFisico = exameFisico;
    }

    await updateDoc(docRef, updateData);
  },

  // Deletar atendimento
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
