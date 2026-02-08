import { useState } from 'react';
import { useMedicamentos, useDeleteMedicamento } from '../hooks/useMedicamentos';
import { Button } from '../components/ui/Button';
import { MedicamentoModal } from '../components/crud/MedicamentoModal';
import type { Medicamento } from '../types';

export const Medicamentos = () => {
  const { data: medicamentos, isLoading } = useMedicamentos();
  const deleteMutation = useDeleteMedicamento();
  const [modalAberto, setModalAberto] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState<Medicamento | null>(null);

  const handleNovo = () => {
    setMedicamentoSelecionado(null);
    setModalAberto(true);
  };

  const handleEditar = (medicamento: Medicamento) => {
    setMedicamentoSelecionado(medicamento);
    setModalAberto(true);
  };

  const handleExcluir = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Medicamentos</h1>
            <p className="mt-1 sm:mt-2 text-sm text-gray-600">Gerencie os medicamentos</p>
          </div>
          <Button onClick={handleNovo} className="w-full sm:w-auto">Novo Medicamento</Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">Carregando...</div>
          ) : medicamentos && medicamentos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicamentos.map((medicamento) => (
                    <tr key={medicamento.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                        {medicamento.nome}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1 sm:gap-2 flex-wrap">
                          <Button
                            variant="secondary"
                            onClick={() => handleEditar(medicamento)}
                            className="text-xs px-2 py-1"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleExcluir(medicamento.id)}
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
              Nenhum medicamento cadastrado
            </div>
          )}
        </div>

        <MedicamentoModal
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false);
            setMedicamentoSelecionado(null);
          }}
          medicamento={medicamentoSelecionado}
        />
      </div>
    </div>
  );
};
