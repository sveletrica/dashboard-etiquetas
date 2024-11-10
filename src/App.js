import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home';
import SobralPage from './pages/Sobral';
import MaracanauPage from './pages/Maracanau';
import CaucaiaPage from './pages/Caucaia';
import ReportsPage from './pages/Reports';
import ItensSemEtiqueta from './pages/ItensSemEtiqueta';
import ConsultaEstoque from './pages/ConsultaEstoque';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobral" element={<SobralPage />} />
          <Route path="/maracanau" element={<MaracanauPage />} />
          <Route path="/caucaia" element={<CaucaiaPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/itens-sem-etiqueta/:filialId" element={<ItensSemEtiqueta />} />
          <Route path="/consulta-estoque" element={<ConsultaEstoque />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;