import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { Atendimento, ExameFisico } from '../../types';
import { MomentoColetaGlicemia } from '../../types';
import { useCreateAtendimento, useUpdateAtendimento } from '../../hooks/useAtendimentos';
import { usePacientes } from '../../hooks/usePacientes';
import { useMedicamentos } from '../../hooks/useMedicamentos';
import { useExames } from '../../hooks/useExames';
import { PacienteModal } from '../crud/PacienteModal';
import { MedicamentoModal } from '../crud/MedicamentoModal';
import { ExameModal } from '../crud/ExameModal';
import { ObservacaoPessoalPaciente } from './ObservacaoPessoalPaciente';
import { ObservacaoSaudePaciente } from './ObservacaoSaudePaciente';

interface AtendimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  atendimento?: Atendimento | null;
  viewOnly?: boolean;
}

export const AtendimentoModal = ({ isOpen, onClose, atendimento, viewOnly = false }: AtendimentoModalProps) => {
  const { data: pacientes, refetch: refetchPacientes } = usePacientes();
  const { data: medicamentos, refetch: refetchMedicamentos } = useMedicamentos();
  const { data: exames, refetch: refetchExames } = useExames();

  const [pacienteId, setPacienteId] = useState<string>('');
  const [pacienteModalAberto, setPacienteModalAberto] = useState(false);
  const [medicamentoModalAberto, setMedicamentoModalAberto] = useState(false);
  const [exameModalAberto, setExameModalAberto] = useState(false);
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [observacao, setObservacao] = useState('');
  const [exameFisico, setExameFisico] = useState<ExameFisico>({});
  const [medicamentosSelecionados, setMedicamentosSelecionados] = useState<string[]>([]);
  const [examesSelecionados, setExamesSelecionados] = useState<string[]>([]);
  const [medicamentoInput, setMedicamentoInput] = useState('');
  const [exameInput, setExameInput] = useState('');
  const [medicamentoInputFocused, setMedicamentoInputFocused] = useState(false);
  const [exameInputFocused, setExameInputFocused] = useState(false);
  const [error, setError] = useState('');

  const createMutation = useCreateAtendimento();
  const updateMutation = useUpdateAtendimento();

  useEffect(() => {
    if (atendimento) {
      setPacienteId(atendimento.pacienteId);
      setData(new Date(atendimento.data).toISOString().split('T')[0]);
      setObservacao(atendimento.observacao || '');
      setExameFisico(atendimento.exameFisico || {});
      setMedicamentosSelecionados(atendimento.medicamentos || []);
      setExamesSelecionados(atendimento.exames || []);
    } else {
      setPacienteId('');
      setData(new Date().toISOString().split('T')[0]);
      setObservacao('');
      setExameFisico({});
      setMedicamentosSelecionados([]);
      setExamesSelecionados([]);
    }
    setError('');
    setMedicamentoInput('');
    setExameInput('');
    setMedicamentoInputFocused(false);
    setExameInputFocused(false);
  }, [atendimento, isOpen]);

  const calcularIMC = () => {
    if (exameFisico.peso && exameFisico.altura && exameFisico.altura > 0) {
      const alturaMetros = exameFisico.altura / 100;
      const imc = Number((exameFisico.peso / (alturaMetros * alturaMetros)).toFixed(2));
      setExameFisico({ ...exameFisico, imc });
    } else {
      setExameFisico({ ...exameFisico, imc: undefined });
    }
  };

  useEffect(() => {
    calcularIMC();
  }, [exameFisico.peso, exameFisico.altura]);

  const pacienteSelecionado = pacientes?.find((p) => p.id === pacienteId);

  const medicamentosFiltrados = medicamentos?.filter(m => 
    !medicamentoInput || m.nome.toLowerCase().includes(medicamentoInput.toLowerCase())
  ) || [];

  const examesFiltrados = exames?.filter(e => 
    !exameInput || e.nome.toLowerCase().includes(exameInput.toLowerCase())
  ) || [];

  const handleAddMedicamento = (medicamentoId?: string) => {
    const idToAdd = medicamentoId || (medicamentosFiltrados.length === 1 ? medicamentosFiltrados[0].id : null);
    if (idToAdd && !medicamentosSelecionados.includes(idToAdd)) {
      setMedicamentosSelecionados([...medicamentosSelecionados, idToAdd]);
      setMedicamentoInput('');
    }
  };

  const handleRemoveMedicamento = (id: string) => {
    setMedicamentosSelecionados(medicamentosSelecionados.filter(m => m !== id));
  };

  const handleAddExame = (exameId?: string) => {
    const idToAdd = exameId || (examesFiltrados.length === 1 ? examesFiltrados[0].id : null);
    if (idToAdd && !examesSelecionados.includes(idToAdd)) {
      setExamesSelecionados([...examesSelecionados, idToAdd]);
      setExameInput('');
    }
  };

  const handleRemoveExame = (id: string) => {
    setExamesSelecionados(examesSelecionados.filter(e => e !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pacienteId) {
      setError('Paciente é obrigatório');
      return;
    }

    try {
      const atendimentoData = {
        pacienteId,
        data: new Date(data),
        observacao: observacao.trim() || undefined,
        exameFisico: Object.keys(exameFisico).length > 0 ? exameFisico : undefined,
        medicamentos: medicamentosSelecionados,
        exames: examesSelecionados,
      };

      if (atendimento) {
        await updateMutation.mutateAsync({
          id: atendimento.id,
          data: atendimentoData,
        });
      } else {
        await createMutation.mutateAsync(atendimentoData);
      }
      onClose();
    } catch (err) {
      setError('Erro ao salvar atendimento');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewOnly ? 'Visualizar Atendimento' : atendimento ? 'Editar Atendimento' : 'Novo Atendimento'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Observações do paciente (quando selecionado) */}
        {pacienteSelecionado && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-800 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <ObservacaoPessoalPaciente value={pacienteSelecionado.observacaoPessoal} />
              <span className="text-gray-400 shrink-0">-</span>
              <ObservacaoSaudePaciente value={pacienteSelecionado.observacaoSaude} />
            </p>
          </div>
        )}

        {/* Dados Básicos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dados do Atendimento</h3>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <div className="flex-1 w-full min-w-0">
              <Select
                label="Paciente *"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                options={[
                  { value: '', label: 'Selecione um paciente' },
                  ...(pacientes?.map(p => ({ value: p.id, label: p.nome })) || [])
                ]}
                required
                disabled={viewOnly}
              />
            </div>
            {!viewOnly && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPacienteModalAberto(true)}
                title="Cadastrar novo paciente"
                className="shrink-0 w-10 h-[42px] px-0 flex items-center justify-center"
              >
                +
              </Button>
            )}
          </div>

          <Input
            label="Data *"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            disabled={viewOnly}
          />

          <Textarea
            label="Observação"
            value={observacao}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setObservacao(e.target.value);
              }
            }}
            maxLength={500}
            rows={4}
            disabled={viewOnly}
          />
          <p className="text-sm text-gray-500">{observacao.length}/500 caracteres</p>
        </div>

        {/* Exame Físico */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Exame Físico</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Pressão Sistólica (mmHg)"
              type="number"
              value={exameFisico.pressaoSistolica || ''}
              onChange={(e) => setExameFisico({ ...exameFisico, pressaoSistolica: e.target.value ? Number(e.target.value) : undefined })}
              disabled={viewOnly}
            />
            <Input
              label="Pressão Diastólica (mmHg)"
              type="number"
              value={exameFisico.pressaoDiastolica || ''}
              onChange={(e) => setExameFisico({ ...exameFisico, pressaoDiastolica: e.target.value ? Number(e.target.value) : undefined })}
              disabled={viewOnly}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Peso (kg)"
              type="number"
              step="0.1"
              value={exameFisico.peso || ''}
              onChange={(e) => setExameFisico({ ...exameFisico, peso: e.target.value ? Number(e.target.value) : undefined })}
              disabled={viewOnly}
            />
            <Input
              label="Altura (cm)"
              type="number"
              step="0.1"
              value={exameFisico.altura || ''}
              onChange={(e) => setExameFisico({ ...exameFisico, altura: e.target.value ? Number(e.target.value) : undefined })}
              disabled={viewOnly}
            />
            <Input
              label="IMC"
              type="number"
              value={exameFisico.imc || ''}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Temperatura (°C)"
              type="number"
              step="0.1"
              value={exameFisico.temperatura || ''}
              onChange={(e) => setExameFisico({ ...exameFisico, temperatura: e.target.value ? Number(e.target.value) : undefined })}
              disabled={viewOnly}
            />
            <div>
              <Input
                label="Glicemia (mg/dL)"
                type="number"
                value={exameFisico.glicemia || ''}
                onChange={(e) => setExameFisico({ ...exameFisico, glicemia: e.target.value ? Number(e.target.value) : undefined })}
                disabled={viewOnly}
              />
              <Select
                label="Momento da Coleta"
                value={exameFisico.momentoColetaGlicemia || ''}
                onChange={(e) => setExameFisico({ ...exameFisico, momentoColetaGlicemia: e.target.value ? Number(e.target.value) as MomentoColetaGlicemia : undefined })}
                options={[
                  { value: '', label: 'Selecione' },
                  { value: MomentoColetaGlicemia.JEJUM, label: 'Jejum' },
                  { value: MomentoColetaGlicemia.POS_PRANDIAL, label: 'Pós-prandial' },
                  { value: MomentoColetaGlicemia.PRE_PRANDIAL, label: 'Pré-prandial' },
                  { value: MomentoColetaGlicemia.NAO_IDENTIFICADO, label: 'Não identificado' },
                ]}
                disabled={viewOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Saturação (%)"
              type="number"
              value={exameFisico.saturacao || ''}
              onChange={(e) => setExameFisico({ ...exameFisico, saturacao: e.target.value ? Number(e.target.value) : undefined })}
              disabled={viewOnly}
            />
            <Input
              label="Circunferência Abdominal (cm)"
              type="number"
              step="0.1"
              value={exameFisico.circunferenciaAbdominal || ''}
              onChange={(e) => setExameFisico({ ...exameFisico, circunferenciaAbdominal: e.target.value ? Number(e.target.value) : undefined })}
              disabled={viewOnly}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Frequência Cardíaca (bpm)"
              type="number"
              value={exameFisico.frequenciaCardiaca || ''}
              onChange={(e) => setExameFisico({ ...exameFisico, frequenciaCardiaca: e.target.value ? Number(e.target.value) : undefined })}
              disabled={viewOnly}
            />
            <Input
              label="Frequência Respiratória (rpm)"
              type="number"
              value={exameFisico.frequenciaRespiratoria || ''}
              onChange={(e) => setExameFisico({ ...exameFisico, frequenciaRespiratoria: e.target.value ? Number(e.target.value) : undefined })}
              disabled={viewOnly}
            />
          </div>
        </div>

        {/* Medicamentos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Medicamentos</h3>
          
          {!viewOnly && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative min-w-0">
                <Input
                  placeholder="Buscar medicamento..."
                  value={medicamentoInput}
                  onChange={(e) => setMedicamentoInput(e.target.value)}
                  onFocus={() => setMedicamentoInputFocused(true)}
                  onBlur={() => {
                    // Delay para permitir o clique no item da lista
                    setTimeout(() => setMedicamentoInputFocused(false), 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMedicamento();
                    }
                  }}
                />
                {medicamentoInputFocused && medicamentosFiltrados.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {medicamentosFiltrados
                      .filter(m => !medicamentosSelecionados.includes(m.id))
                      .map(med => (
                        <button
                          key={med.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()} // Previne o blur antes do click
                          onClick={() => {
                            handleAddMedicamento(med.id);
                            setMedicamentoInputFocused(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          {med.nome}
                        </button>
                      ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={() => handleAddMedicamento()} disabled={medicamentosFiltrados.length === 0 || medicamentosFiltrados.filter(m => !medicamentosSelecionados.includes(m.id)).length === 0} className="flex-1 sm:flex-none">
                  Adicionar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setMedicamentoModalAberto(true)}
                  title="Cadastrar novo medicamento"
                  className="shrink-0 w-10 px-0 flex items-center justify-center"
                >
                  +
                </Button>
              </div>
            </div>
          )}

          {medicamentosSelecionados.length > 0 && (
            <div className="space-y-2">
              {medicamentosSelecionados.map(id => {
                const medicamento = medicamentos?.find(m => m.id === id);
                return medicamento ? (
                  <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{medicamento.nome}</span>
                    {!viewOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicamento(id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Exames */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Exames</h3>
          
          {!viewOnly && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative min-w-0">
                <Input
                  placeholder="Buscar exame..."
                  value={exameInput}
                  onChange={(e) => setExameInput(e.target.value)}
                  onFocus={() => setExameInputFocused(true)}
                  onBlur={() => {
                    // Delay para permitir o clique no item da lista
                    setTimeout(() => setExameInputFocused(false), 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExame();
                    }
                  }}
                />
                {exameInputFocused && examesFiltrados.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {examesFiltrados
                      .filter(e => !examesSelecionados.includes(e.id))
                      .map(ex => (
                        <button
                          key={ex.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()} // Previne o blur antes do click
                          onClick={() => {
                            handleAddExame(ex.id);
                            setExameInputFocused(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          {ex.nome}
                        </button>
                      ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={() => handleAddExame()} disabled={examesFiltrados.length === 0 || examesFiltrados.filter(e => !examesSelecionados.includes(e.id)).length === 0} className="flex-1 sm:flex-none">
                  Adicionar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setExameModalAberto(true)}
                  title="Cadastrar novo exame"
                  className="shrink-0 w-10 px-0 flex items-center justify-center"
                >
                  +
                </Button>
              </div>
            </div>
          )}

          {examesSelecionados.length > 0 && (
            <div className="space-y-2">
              {examesSelecionados.map(id => {
                const exame = exames?.find(e => e.id === id);
                return exame ? (
                  <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{exame.nome}</span>
                    {!viewOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExame(id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!viewOnly && (
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full sm:w-auto">
              {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        )}

        {viewOnly && (
          <div className="flex justify-end pt-4 border-t">
            <Button type="button" onClick={onClose} className="w-full sm:w-auto">
              Fechar
            </Button>
          </div>
        )}
      </form>

      <PacienteModal
        isOpen={pacienteModalAberto}
        onClose={() => setPacienteModalAberto(false)}
        onPacienteCreated={async (id) => {
          await refetchPacientes();
          setPacienteId(id);
          setPacienteModalAberto(false);
        }}
      />

      <MedicamentoModal
        isOpen={medicamentoModalAberto}
        onClose={() => setMedicamentoModalAberto(false)}
        onMedicamentoCreated={async (id) => {
          await refetchMedicamentos();
          setMedicamentosSelecionados((prev) => (prev.includes(id) ? prev : [...prev, id]));
          setMedicamentoModalAberto(false);
        }}
      />

      <ExameModal
        isOpen={exameModalAberto}
        onClose={() => setExameModalAberto(false)}
        onExameCreated={async (id) => {
          await refetchExames();
          setExamesSelecionados((prev) => (prev.includes(id) ? prev : [...prev, id]));
          setExameModalAberto(false);
        }}
      />
    </Modal>
  );
};
