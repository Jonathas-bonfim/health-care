import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exameService } from '../services/exameService';
import type { Exame } from '../types';

export const useExames = () => {
  return useQuery({
    queryKey: ['exames'],
    queryFn: () => exameService.getAll(),
  });
};

export const useExame = (id: string) => {
  return useQuery({
    queryKey: ['exame', id],
    queryFn: () => exameService.getById(id),
    enabled: !!id,
  });
};

export const useCreateExame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (exame: Omit<Exame, 'id' | 'createdAt' | 'updatedAt'>) =>
      exameService.create(exame),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames'] });
    },
  });
};

export const useUpdateExame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Exame, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      exameService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exames'] });
      queryClient.invalidateQueries({ queryKey: ['exame', variables.id] });
    },
  });
};

export const useDeleteExame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => exameService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames'] });
    },
  });
};
