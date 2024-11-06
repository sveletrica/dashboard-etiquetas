import React from 'react';

const HomePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-allotrope font-semibold text-gray-900 mb-6">
        Bem-vindo ao Sistema de Etiquetas
      </h1>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-gray-600 mb-4">
          Selecione uma opção no menu lateral para começar:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Dashboard - Visualize estatísticas e métricas em tempo real</li>
          <li>Relatórios - Acesse relatórios detalhados e análises</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;