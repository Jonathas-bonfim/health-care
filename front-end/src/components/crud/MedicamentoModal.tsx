import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Medicamento } from '../../types';
import { useCreateMedicamento, useUpdateMedicamento } from '../../hooks/useMedicamentos';

interface MedicamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicamento?: Medicamento | null;
  /** Chamado ao criar um novo medicamento (não na edição), recebe o id criado */
  onMedicamentoCreated?: (id: string) => void;
}

export const MedicamentoModal = ({ isOpen, onClose, medicamento, onMedicamentoCreated }: MedicamentoModalProps) => {
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');

  const createMutation = useCreateMedicamento();
  const updateMutation = useUpdateMedicamento();

  useEffect(() => {
    if (medicamento) {
      setNome(medicamento.nome);
    } else {
      setNome('');
    }
    setError('');
  }, [medicamento, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    try {
      if (medicamento) {
        await updateMutation.mutateAsync({
          id: medicamento.id,
          data: { nome },
        });
      } else {
        const newId = await createMutation.mutateAsync({ nome });
        onMedicamentoCreated?.(newId);
      }
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar medicamento:', err);
      const errorMessage = err?.message || 'Erro ao salvar medicamento';
      setError(`Erro: ${errorMessage}. Verifique o console para mais detalhes.`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={medicamento ? 'Editar Medicamento' : 'Novo Medicamento'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
