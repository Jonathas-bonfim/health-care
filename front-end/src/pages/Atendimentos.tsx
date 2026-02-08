import { useState } from 'react';
import { AtendimentosList } from '../components/atendimentos/AtendimentosList';
import { AtendimentoModal } from '../components/atendimentos/AtendimentoModal';

export const Atendimentos = () => {
  const [modalNovoAberto, setModalNovoAberto] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Atendimentos</h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600">Gerencie os atendimentos médicos</p>
        </div>

        <AtendimentosList onNewClick={() => setModalNovoAberto(true)} />

        <AtendimentoModal
          isOpen={modalNovoAberto}
          onClose={() => setModalNovoAberto(false)}
        />
      </div>
    </div>
  );
};
