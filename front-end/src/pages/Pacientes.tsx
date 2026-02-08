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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
            <p className="mt-2 text-sm text-gray-600">Gerencie os pacientes</p>
          </div>
          <Button onClick={handleNovo}>Novo Paciente</Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Carregando...</div>
          ) : pacientes && pacientes.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pacientes.map((paciente) => (
                  <tr key={paciente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paciente.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {paciente.telefone ?? '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {paciente.email ?? '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
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
          ) : (
            <div className="p-8 text-center text-gray-500">
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
