import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Exame } from '../../types';
import { useCreateExame, useUpdateExame } from '../../hooks/useExames';

interface ExameModalProps {
  isOpen: boolean;
  onClose: () => void;
  exame?: Exame | null;
  /** Chamado ao criar um novo exame (não na edição), recebe o id criado */
  onExameCreated?: (id: string) => void;
}

export const ExameModal = ({ isOpen, onClose, exame, onExameCreated }: ExameModalProps) => {
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');

  const createMutation = useCreateExame();
  const updateMutation = useUpdateExame();

  useEffect(() => {
    if (exame) {
      setNome(exame.nome);
    } else {
      setNome('');
    }
    setError('');
  }, [exame, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    try {
      if (exame) {
        await updateMutation.mutateAsync({
          id: exame.id,
          data: { nome },
        });
      } else {
        const newId = await createMutation.mutateAsync({ nome });
        onExameCreated?.(newId);
      }
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar exame:', err);
      const errorMessage = err?.message || 'Erro ao salvar exame';
      setError(`Erro: ${errorMessage}. Verifique o console para mais detalhes.`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exame ? 'Editar Exame' : 'Novo Exame'}
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
