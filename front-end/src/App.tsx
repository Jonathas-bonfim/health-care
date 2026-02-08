import { useState } from 'react';
import { Atendimentos } from './pages/Atendimentos';
import { Pacientes } from './pages/Pacientes';
import { Medicamentos } from './pages/Medicamentos';
import { Exames } from './pages/Exames';

type Page = 'atendimentos' | 'pacientes' | 'medicamentos' | 'exames';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('atendimentos');

  const navigation = [
    { id: 'atendimentos' as Page, label: 'Atendimentos', icon: '📋' },
    { id: 'pacientes' as Page, label: 'Pacientes', icon: '👤' },
    { id: 'medicamentos' as Page, label: 'Medicamentos', icon: '💊' },
    { id: 'exames' as Page, label: 'Exames', icon: '🔬' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'atendimentos':
        return <Atendimentos />;
      case 'pacientes':
        return <Pacientes />;
      case 'medicamentos':
        return <Medicamentos />;
      case 'exames':
        return <Exames />;
      default:
        return <Atendimentos />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Sistema de Saúde</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  currentPage === item.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
