import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicamentoService } from '../services/medicamentoService';
import type { Medicamento } from '../types';

export const useMedicamentos = () => {
  return useQuery({
    queryKey: ['medicamentos'],
    queryFn: () => medicamentoService.getAll(),
  });
};

export const useMedicamento = (id: string) => {
  return useQuery({
    queryKey: ['medicamento', id],
    queryFn: () => medicamentoService.getById(id),
    enabled: !!id,
  });
};

export const useCreateMedicamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (medicamento: Omit<Medicamento, 'id' | 'createdAt' | 'updatedAt'>) =>
      medicamentoService.create(medicamento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
    },
  });
};

export const useUpdateMedicamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Medicamento, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      medicamentoService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
      queryClient.invalidateQueries({ queryKey: ['medicamento', variables.id] });
    },
  });
};

export const useDeleteMedicamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => medicamentoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
    },
  });
};
