import React from 'react';
import DashboardEtiquetas from '../../components/DashboardEtiquetas';
import { FILIAIS } from '../../config/filiais';

const CaucaiaPage = () => {
  return <DashboardEtiquetas filial={FILIAIS.CAUCAIA} />;
};

export default CaucaiaPage;