import { useState } from 'react';
import type { Atendimento } from '../../types';
import { useAtendimentos } from '../../hooks/useAtendimentos';
import { usePacientes } from '../../hooks/usePacientes';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { AtendimentoModal } from './AtendimentoModal';
import { useDeleteAtendimento } from '../../hooks/useAtendimentos';

interface AtendimentosListProps {
  onNewClick: () => void;
}

export const AtendimentosList = ({ onNewClick }: AtendimentosListProps) => {
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [pacienteId, setPacienteId] = useState<string>('');
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState<Atendimento | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);

  const { data: pacientes } = usePacientes();
  const deleteMutation = useDeleteAtendimento();

  const filters = {
    dataInicial: dataInicial ? new Date(dataInicial) : undefined,
    dataFinal: dataFinal ? new Date(dataFinal) : undefined,
    pacienteId: pacienteId || undefined,
  };

  const { data: atendimentos, isLoading } = useAtendimentos(filters);

  const handleBuscar = () => {
    // A busca é automática através do React Query quando os filtros mudam
  };

  const handleVisualizar = (atendimento: Atendimento) => {
    setAtendimentoSelecionado(atendimento);
    setViewOnly(true);
    setModalAberto(true);
  };

  const handleEditar = (atendimento: Atendimento) => {
    setAtendimentoSelecionado(atendimento);
    setViewOnly(false);
    setModalAberto(true);
  };

  const handleExcluir = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este atendimento?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <Input
            label="Data Inicial"
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
          />
          <Input
            label="Data Final"
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
          />
          <Select
            label="Paciente"
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            options={[
              { value: '', label: 'Todos os pacientes' },
              ...(pacientes?.map(p => ({ value: p.id, label: p.nome })) || [])
            ]}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleBuscar} className="w-full sm:w-auto">Buscar</Button>
          <Button onClick={onNewClick} className="w-full sm:w-auto">Novo</Button>
        </div>
      </div>

      {/* Lista de Atendimentos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-6 sm:p-8 text-center text-gray-500">Carregando...</div>
        ) : atendimentos && atendimentos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Observação</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {atendimentos.map((atendimento) => (
                  <tr key={atendimento.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(atendimento.data)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                      {atendimento.paciente?.nome ?? `Paciente (${atendimento.pacienteId})`}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 hidden md:table-cell">
                      <div className="max-w-md truncate">{atendimento.observacao || '-'}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1 sm:gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          onClick={() => handleVisualizar(atendimento)}
                          className="text-xs px-2 py-1"
                        >
                          Ver
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleEditar(atendimento)}
                          className="text-xs px-2 py-1"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleExcluir(atendimento.id)}
                          className="text-xs px-2 py-1"
                          disabled={deleteMutation.isPending}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center text-gray-500">
            Nenhum atendimento encontrado
          </div>
        )}
      </div>

      {/* Modal */}
      <AtendimentoModal
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setAtendimentoSelecionado(null);
        }}
        atendimento={atendimentoSelecionado}
        viewOnly={viewOnly}
      />
    </div>
  );
};
