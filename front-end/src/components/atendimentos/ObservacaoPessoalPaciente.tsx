interface ObservacaoPessoalPacienteProps {
  value?: string | null;
}

/** Exibe "Observação pessoal: valor" na mesma linha; linhas do valor separadas por " - " */
export const ObservacaoPessoalPaciente = ({ value }: ObservacaoPessoalPacienteProps) => {
  const texto = value?.trim();
  const exibir = texto ? texto.split(/\n/).join(' - ') : '—';
  return (
    <span className="text-sm text-gray-800">
      <span className="font-medium text-gray-600">Observação pessoal: </span>
      {exibir}
    </span>
  );
};
