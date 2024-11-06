import React from 'react';
import DashboardEtiquetas from '../../components/DashboardEtiquetas';
import { FILIAIS } from '../../config/filiais';

const MaracanauPage = () => {
  return <DashboardEtiquetas filial={FILIAIS.MARACANAU} />;
};

export default MaracanauPage;