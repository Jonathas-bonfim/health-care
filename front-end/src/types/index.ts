// Momento da coleta de glicemia (const + type para compatibilidade com erasableSyntaxOnly)
export const MomentoColetaGlicemia = {
  JEJUM: 1,
  POS_PRANDIAL: 2,
  PRE_PRANDIAL: 3,
  NAO_IDENTIFICADO: 4,
} as const;

export type MomentoColetaGlicemia = (typeof MomentoColetaGlicemia)[keyof typeof MomentoColetaGlicemia];

// Tipo para exame físico
export interface ExameFisico {
  pressaoSistolica?: number;
  pressaoDiastolica?: number;
  peso?: number;
  altura?: number;
  imc?: number; // Calculado automaticamente
  temperatura?: number;
  glicemia?: number;
  momentoColetaGlicemia?: MomentoColetaGlicemia;
  saturacao?: number;
  circunferenciaAbdominal?: number;
  frequenciaCardiaca?: number;
  frequenciaRespiratoria?: number;
}

// Tipo para Paciente
export interface Paciente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacaoPessoal?: string;
  observacaoSaude?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para Medicamento
export interface Medicamento {
  id: string;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para Exame
export interface Exame {
  id: string;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para Atendimento
export interface Atendimento {
  id: string;
  pacienteId: string; // ID (UUID) do paciente
  paciente?: Paciente; // Dados do paciente (opcional, para exibição)
  data: Date;
  observacao?: string;
  exameFisico?: ExameFisico;
  medicamentos: string[]; // IDs dos medicamentos
  exames: string[]; // IDs dos exames
  createdAt: Date;
  updatedAt: Date;
}
