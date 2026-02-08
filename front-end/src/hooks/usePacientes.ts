import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pacienteService } from '../services/pacienteService';
import type { Paciente } from '../types';

export const usePacientes = () => {
  return useQuery({
    queryKey: ['pacientes'],
    queryFn: () => pacienteService.getAll(),
  });
};

export const usePaciente = (id: string) => {
  return useQuery({
    queryKey: ['paciente', id],
    queryFn: () => pacienteService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePaciente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paciente: Omit<Paciente, 'id' | 'createdAt' | 'updatedAt'>) =>
      pacienteService.create(paciente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
    },
  });
};

export const useUpdatePaciente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Paciente, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      pacienteService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['paciente', variables.id] });
    },
  });
};

export const useDeletePaciente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => pacienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
    },
  });
};
