interface ObservacaoSaudePacienteProps {
  value?: string | null;
}

/** Exibe "Observação de saúde: valor" na mesma linha; linhas do valor separadas por " - " */
export const ObservacaoSaudePaciente = ({ value }: ObservacaoSaudePacienteProps) => {
  const texto = value?.trim();
  const exibir = texto ? texto.split(/\n/).join(' - ') : '—';
  return (
    <span className="text-sm text-gray-800">
      <span className="font-medium text-gray-600">Observação de saúde: </span>
      {exibir}
    </span>
  );
};
