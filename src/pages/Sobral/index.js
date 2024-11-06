import React from 'react';
import DashboardEtiquetas from '../../components/DashboardEtiquetas';
import { FILIAIS } from '../../config/filiais';

const SobralPage = () => {
  return <DashboardEtiquetas filial={FILIAIS.SOBRAL} />;
};

export default SobralPage;