import { useState } from 'react';
import { useExames, useDeleteExame } from '../hooks/useExames';
import { Button } from '../components/ui/Button';
import { ExameModal } from '../components/crud/ExameModal';
import type { Exame } from '../types';

export const Exames = () => {
  const { data: exames, isLoading } = useExames();
  const deleteMutation = useDeleteExame();
  const [modalAberto, setModalAberto] = useState(false);
  const [exameSelecionado, setExameSelecionado] = useState<Exame | null>(null);

  const handleNovo = () => {
    setExameSelecionado(null);
    setModalAberto(true);
  };

  const handleEditar = (exame: Exame) => {
    setExameSelecionado(exame);
    setModalAberto(true);
  };

  const handleExcluir = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este exame?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exames</h1>
            <p className="mt-2 text-sm text-gray-600">Gerencie os exames</p>
          </div>
          <Button onClick={handleNovo}>Novo Exame</Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Carregando...</div>
          ) : exames && exames.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exames.map((exame) => (
                  <tr key={exame.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exame.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleEditar(exame)}
                          className="text-xs px-2 py-1"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleExcluir(exame.id)}
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
              Nenhum exame cadastrado
            </div>
          )}
        </div>

        <ExameModal
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false);
            setExameSelecionado(null);
          }}
          exame={exameSelecionado}
        />
      </div>
    </div>
  );
};
