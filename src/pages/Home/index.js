import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Tags, 
  FileText, 
  Search, 
  AlertTriangle,
  Building2
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Dashboards',
      icon: <BarChart2 className="h-6 w-6 text-red-500" />,
      description: 'Visualize estatísticas e métricas em tempo real das etiquetas por filial',
      options: [
        { name: 'Sobral', path: '/sobral' },
        { name: 'Maracanaú', path: '/maracanau' },
        { name: 'Caucaia', path: '/caucaia' }
      ]
    },
    {
      title: 'Consulta de Estoque',
      icon: <Search className="h-6 w-6 text-blue-500" />,
      description: 'Sistema avançado de consulta de estoque com filtros e exportação',
      path: '/consulta-estoque'
    },
    {
      title: 'Itens Sem Etiqueta',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      description: 'Lista detalhada de produtos que necessitam de etiquetagem',
      path: '/itens-sem-etiqueta'
    },
    {
      title: 'Relatórios',
      icon: <FileText className="h-6 w-6 text-green-500" />,
      description: 'Acesse relatórios detalhados e análises históricas',
      path: '/reports'
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-allotrope font-semibold text-gray-900">
              Sistema de Etiquetas
            </h1>
            <p className="text-gray-500 mt-1">
              Monitoramento e gestão de etiquetas da SV Elétrica
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {item.icon}
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>
                  
                  {item.options ? (
                    <div className="flex flex-wrap gap-2">
                      {item.options.map((option) => (
                        <button
                          key={option.path}
                          onClick={() => navigate(option.path)}
                          className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(item.path)}
                      className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      Acessar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tags className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-medium text-gray-900">
              Recursos Disponíveis
            </h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Monitoramento em tempo real
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Cache local para melhor performance
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Exportação de dados para Excel
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Filtros avançados de busca
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Gráficos interativos
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Interface responsiva
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;