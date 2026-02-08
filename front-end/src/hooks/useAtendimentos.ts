import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { atendimentoService } from '../services/atendimentoService';
import type { Atendimento } from '../types';

interface AtendimentoFilters {
  dataInicial?: Date;
  dataFinal?: Date;
  pacienteId?: string;
}

export const useAtendimentos = (filters?: AtendimentoFilters) => {
  return useQuery({
    queryKey: ['atendimentos', filters],
    queryFn: () => atendimentoService.getAll(filters),
  });
};

export const useAtendimento = (id: string) => {
  return useQuery({
    queryKey: ['atendimento', id],
    queryFn: () => atendimentoService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAtendimento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (atendimento: Omit<Atendimento, 'id' | 'createdAt' | 'updatedAt'>) =>
      atendimentoService.create(atendimento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
    },
  });
};

export const useUpdateAtendimento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Atendimento, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      atendimentoService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
      queryClient.invalidateQueries({ queryKey: ['atendimento', variables.id] });
    },
  });
};

export const useDeleteAtendimento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => atendimentoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
    },
  });
};
