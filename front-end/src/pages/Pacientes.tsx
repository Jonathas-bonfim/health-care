import { useState } from 'react';
import { usePacientes, useDeletePaciente } from '../hooks/usePacientes';
import { Button } from '../components/ui/Button';
import { PacienteModal } from '../components/crud/PacienteModal';
import type { Paciente } from '../types';

export const Pacientes = () => {
  const { data: pacientes, isLoading } = usePacientes();
  const deleteMutation = useDeletePaciente();
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);

  const handleNovo = () => {
    setPacienteSelecionado(null);
    setModalAberto(true);
  };

  const handleEditar = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setModalAberto(true);
  };

  const handleExcluir = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pacientes</h1>
            <p className="mt-1 sm:mt-2 text-sm text-gray-600">Gerencie os pacientes</p>
          </div>
          <Button onClick={handleNovo} className="w-full sm:w-auto">Novo Paciente</Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">Carregando...</div>
          ) : pacientes && pacientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">E-mail</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pacientes.map((paciente) => (
                    <tr key={paciente.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                        <span className="font-medium">{paciente.nome}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600">{paciente.telefone ?? '-'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">{paciente.email ?? '-'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1 sm:gap-2 flex-wrap">
                          <Button
                            variant="secondary"
                            onClick={() => handleEditar(paciente)}
                            className="text-xs px-2 py-1"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleExcluir(paciente.id)}
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
              Nenhum paciente cadastrado
            </div>
          )}
        </div>

        <PacienteModal
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false);
            setPacienteSelecionado(null);
          }}
          paciente={pacienteSelecionado}
        />
      </div>
    </div>
  );
};
