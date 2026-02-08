import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { Paciente } from '../../types';
import { useCreatePaciente, useUpdatePaciente } from '../../hooks/usePacientes';

interface PacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente?: Paciente | null;
  /** Chamado ao criar um novo paciente (não na edição), recebe o id do paciente criado */
  onPacienteCreated?: (id: string) => void;
}

export const PacienteModal = ({ isOpen, onClose, paciente, onPacienteCreated }: PacienteModalProps) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacaoPessoal, setObservacaoPessoal] = useState('');
  const [observacaoSaude, setObservacaoSaude] = useState('');
  const [error, setError] = useState('');

  const createMutation = useCreatePaciente();
  const updateMutation = useUpdatePaciente();

  useEffect(() => {
    if (paciente) {
      setNome(paciente.nome);
      setTelefone(paciente.telefone ?? '');
      setEmail(paciente.email ?? '');
      setEndereco(paciente.endereco ?? '');
      setObservacaoPessoal(paciente.observacaoPessoal ?? '');
      setObservacaoSaude(paciente.observacaoSaude ?? '');
    } else {
      setNome('');
      setTelefone('');
      setEmail('');
      setEndereco('');
      setObservacaoPessoal('');
      setObservacaoSaude('');
    }
    setError('');
  }, [paciente, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    const data = {
      nome,
      telefone: telefone.trim() || undefined,
      email: email.trim() || undefined,
      endereco: endereco.trim() || undefined,
      observacaoPessoal: observacaoPessoal.trim() || undefined,
      observacaoSaude: observacaoSaude.trim() || undefined,
    };

    try {
      if (paciente) {
        await updateMutation.mutateAsync({ id: paciente.id, data });
      } else {
        const newId = await createMutation.mutateAsync(data);
        onPacienteCreated?.(newId);
      }
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar paciente:', err);
      const errorMessage = err?.message || 'Erro ao salvar paciente';
      setError(`Erro: ${errorMessage}. Verifique o console para mais detalhes.`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={paciente ? 'Editar Paciente' : 'Novo Paciente'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          label="Telefone"
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(00) 00000-0000"
        />
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
        />
        <Input
          label="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Rua, número, bairro, cidade..."
        />
        <Textarea
          label="Observação pessoal"
          value={observacaoPessoal}
          onChange={(e) => setObservacaoPessoal(e.target.value)}
          placeholder="Anotações gerais sobre o paciente"
          rows={3}
        />
        <Textarea
          label="Observação de saúde"
          value={observacaoSaude}
          onChange={(e) => setObservacaoSaude(e.target.value)}
          placeholder="Informações relevantes sobre saúde, alergias, condições etc."
          rows={3}
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
