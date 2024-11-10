import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart as BarChartRecharts, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { 
  Package, 
  Tags, 
  AlertCircle, 
  BarChart2, 
  Info, 
  RotateCw,
  AlertTriangle,
  Barcode,
  Check
} from 'lucide-react';

// Função auxiliar para formatar data
const formatLastUpdate = (date) => {
  if (!date) return '';
  
  const options = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  return date.toLocaleString('pt-BR', options);
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // 1024px is the 'lg' breakpoint

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const DashboardEtiquetas = ({ filial }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingTime, setLoadingTime] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastUpdateDuration, setLastUpdateDuration] = useState(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const TOTAL_UPDATE_TIME = 25000; // 25 segundos em milissegundos
  const UPDATE_INTERVAL = 100; // Atualiza a cada 100ms para animação suave
  const SUCCESS_ANIMATION_DURATION = 1000; // 1 segundo para a animação de sucesso

  const CACHE_KEY = `dashboard_etiquetas_cache_${filial.id}`;
  const CACHE_TIMESTAMP_KEY = `dashboard_etiquetas_last_update_${filial.id}`;
  const CACHE_DURATION_KEY = `dashboard_etiquetas_update_duration_${filial.id}`;

  const isValidCache = (cachedData) => {
    try {
      const data = JSON.parse(cachedData);
      return data.emStkSemEtiq !== undefined && 
        data.bindSemStk !== undefined && 
        data.skuetiquetados !== undefined;
    } catch (error) {
      return false;
    }
  };

  const saveToCache = useCallback((data, timestamp, duration) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toISOString());
      localStorage.setItem(CACHE_DURATION_KEY, duration.toString());
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }, [CACHE_KEY, CACHE_TIMESTAMP_KEY, CACHE_DURATION_KEY]);

  const loadFromCache = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const cachedDuration = localStorage.getItem(CACHE_DURATION_KEY);

      if (cachedData && cachedTimestamp && isValidCache(cachedData)) { // Adicionada verificação
        setStats(JSON.parse(cachedData));
        setLastUpdate(new Date(cachedTimestamp));
        setLastUpdateDuration(parseFloat(cachedDuration));
        setLoading(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
      return false;
    }
  }, [CACHE_KEY, CACHE_TIMESTAMP_KEY, CACHE_DURATION_KEY]);

  const clearLoadingTimer = useCallback(() => {
    setLoadingTime(0);
  }, []);

  // Função para gerenciar a animação de progresso
  const startUpdateAnimation = useCallback(() => {
    setUpdateProgress(0);
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed / TOTAL_UPDATE_TIME) * 100;
      
      if (progress >= 100) {
        clearInterval(interval);
        setUpdateProgress(0);
      } else {
        setUpdateProgress(progress);
      }
    }, UPDATE_INTERVAL);

    return interval;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingTime(0);
      const startTime = Date.now();

      // Inicia a animação de progresso
      const progressInterval = startUpdateAnimation();

      const response = await fetch(filial.webhook);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }
      const data = await response.json();
      
      const processedData = {
        totalEstoque: data.totalEstoque || 0,
        produtosEtiquetados: data.produtosEtiquetados || 0,
        produtosSemEtiqueta: data.produtosSemEtiqueta || 0,
        produtosMultiplasEtiquetas: data.produtosMultiplasEtiquetas || 0,
        etiquetasDuplicadas: data.etiquetasDuplicadas || 0,
        emStkSemEtiq: parseInt(data.emStkSemEtiq) || 0,
        bindSemStk: parseInt(data.bindSemStk) || 0,
        skuetiquetados: parseInt(data.skuetiquetados) || 0
      };

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const timestamp = new Date();

      setStats(processedData);
      setLastUpdate(timestamp);
      setLastUpdateDuration(duration);
      setError(null);

      saveToCache(processedData, timestamp, duration);

      // Limpa o intervalo da animação quando os dados chegarem
      clearInterval(progressInterval);
      setUpdateProgress(100);
      setShowSuccess(true);
      
      // Timer para remover a animação de sucesso
      setTimeout(() => {
        setShowSuccess(false);
        setUpdateProgress(0);
      }, SUCCESS_ANIMATION_DURATION);

    } catch (err) {
      setError(err.message);
      setUpdateProgress(0);
      setShowSuccess(false);
    } finally {
      setLoading(false);
      clearLoadingTimer();
    }
  }, [filial.webhook, saveToCache, clearLoadingTimer, startUpdateAnimation]);

  useEffect(() => {
    const hasCache = loadFromCache();
    if (!hasCache) {
      fetchData();
    }
  }, [loadFromCache, fetchData]);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading]);

  const isMobile = useIsMobile();

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados... ({loadingTime}s)</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const chartData = [
    {
      name: 'Etiquetados',
      value: stats.produtosEtiquetados - stats.etiquetasDuplicadas,
      percentual: ((stats.produtosEtiquetados - stats.produtosMultiplasEtiquetas) / stats.skuetiquetados * 100).toFixed(1)
    },
    {
      name: 'Etiquetas em Duplicidade',
      value: stats.etiquetasDuplicadas,
      percentual: (stats.produtosMultiplasEtiquetas / stats.skuetiquetados * 100).toFixed(1)
    },
    {
      name: 'Bind sem Stk',
      value: stats.bindSemStk,
      percentual: (stats.bindSemStk / stats.skuetiquetados * 100).toFixed(1)
    }
  ];

  const CustomLabel = (props) => {
    const { x, y, width, value } = props;
    const dataItem = chartData.find(item => item.value === value);
    const percentual = dataItem ? dataItem.percentual : '0.0';
    
    return (
      <text x={x + width / 2} y={y - 10} fill="#666" textAnchor="middle" fontSize="12">
        {`${value.toLocaleString()} (${percentual}%)`}
      </text>
    );
  };
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <div className="p-4 md:p-6 flex-1 flex flex-col max-w-[1440px] mx-auto w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                 {/*    <img
                      src="/logo-sv.png"
                      alt="Logo SV Sobral"
                      className="h-10 w-auto"
                    /> */}
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900 font-allotrope">
                      Etiquetas SV {filial.nome}
                    </h1>
                  </div>
                  <button
                    onClick={fetchData}
                    disabled={loading}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 w-full sm:w-auto justify-center overflow-hidden
                      ${showSuccess 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-800'
                      } 
                      text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {/* Barra de progresso */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 transition-all duration-100 ease-linear
                        ${showSuccess ? 'bg-green-600' : 'bg-red-800'}`}
                      style={{ width: `${updateProgress}%` }}
                    />
                    
                    {/* Conteúdo do botão */}
                    <div className="relative z-10 flex items-center gap-2">
                      {showSuccess ? (
                        <Check className="h-4 w-4 animate-[scale-in_0.3s_ease-in-out]" />
                      ) : (
                        <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      )}
                      {loading 
                        ? `Atualizando... (${loadingTime}s)` 
                        : showSuccess 
                          ? 'Atualizado!'
                          : 'Atualizar dados'
                      }
                    </div>
                  </button>
                </div>
        
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-blue-500" />
                      <p className="text-sm font-medium text-gray-500 font-allotrope">Total em Estoque</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-medium text-gray-900">{stats.totalEstoque.toLocaleString()}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">produtos em stk no ERP</p>
                  </div>
        
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Tags className="h-5 w-5 text-green-500" />
                      <p className="text-sm font-medium text-gray-500 font-allotrope">Etiquetas em Uso</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-medium text-gray-900">{stats.produtosEtiquetados.toLocaleString()}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {(stats.produtosEtiquetados / stats.totalEstoque * 100).toFixed(1)}% do total
                    </p>
                  </div>
        
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-sm font-medium text-gray-500 font-allotrope">Em Stk sem etiqueta</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-medium text-gray-900">{stats.emStkSemEtiq.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs md:text-sm text-gray-500">
                      {(stats.emStkSemEtiq / stats.totalEstoque * 100).toFixed(1)}% do total
                    </p>
                    <button
                      onClick={() => navigate(`/itens-sem-etiqueta/${filial.id}`)}
                      className="text-xs md:text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Ver detalhes →
                    </button>
                  </div>
                </div>
                </div>
        
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm h-[400px] lg:h-[530px] col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart2 className="h-5 w-5 text-blue-500" />
                      <h2 className="text-base md:text-lg font-medium text-gray-900 font-allotrope">Distribuição de Etiquetas</h2>
                    </div>
                    <div className="h-[calc(100%-2rem)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChartRecharts data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: isMobile ? 40 : 20 }}>
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={(props) => {
                              const { x, y, payload } = props;
                              
                              if (isMobile) {
                                const words = payload.value.split(' ');
                                return (
                                  <g transform={`translate(${x},${y + 10})`}>
                                    {words.map((word, index) => (
                                      <text
                                        key={index}
                                        x={0}
                                        y={index * 10}
                                        dy={0}
                                        textAnchor="middle"
                                        fill="#666"
                                        fontSize={12}
                                      >
                                        {word}
                                      </text>
                                    ))}
                                  </g>
                                );
                              }
                              
                              // Desktop version
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  dy={16}
                                  textAnchor="middle"
                                  fill="#666"
                                  fontSize={12}
                                >
                                  {payload.value}
                                </text>
                              );
                            }}
                            height={isMobile ? 10 : 30}
                            interval={0}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                            scale="log" // Adiciona escala logarítmica
                            domain={[10, 'auto']} // Ajusta o domínio automaticamente
                            allowDataOverflow={false} // Permite que os dados excedam o domínio
                            tickFormatter={(value) => value.toLocaleString()} // Formata os números no eixo
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill="#FF1800"
                            radius={[4, 4, 0, 0]}
                          >
                             <Cell fill="#34C759" /> {/* Etiquetados */}
                             <Cell fill="#d6da09" /> {/* Múltiplas Etiquetas */}
                             <Cell fill="#ff0022" /> {/* Bind sem Stk */}
                            <LabelList 
                              content={<CustomLabel />}
                              position="top"
                              className="text-xs md:text-sm"
                            />
                          </Bar>
                        </BarChartRecharts>
                      </ResponsiveContainer>
                    </div>
                  </div>
        
<div className="bg-white p-4 rounded-2xl shadow-sm h-[530px] overflow-y-auto">
  <div className="flex items-center gap-2 mb-4">
    <Info className="h-5 w-5 text-blue-500" />
    <h2 className="text-base md:text-lg font-medium text-gray-900">Detalhes Adicionais</h2>
  </div>
  <div className="space-y-6">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Tags className="h-4 w-4 text-orange-500" />
        <p className="text-xs md:text-sm font-medium text-gray-500">
          Produtos com Múltiplas Etiquetas
        </p>
      </div>
      <p className="text-2xl md:text-3xl font-medium text-gray-900">
        {stats.produtosMultiplasEtiquetas.toLocaleString()}
      </p>
      <p className="text-xs md:text-sm text-gray-500 mt-1">
        {(stats.produtosMultiplasEtiquetas / stats.totalEstoque * 100).toFixed(1)}% do total
      </p>
    </div>

    <div>
      <div className="flex items-center gap-2 mb-1">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <p className="text-xs md:text-sm font-medium text-gray-500">
          Etiquetas Duplicadas/Triplicadas
        </p>
      </div>
      <p className="text-2xl md:text-3xl font-medium text-gray-900">
        {stats.etiquetasDuplicadas.toLocaleString()}
      </p>
      <p className="text-xs md:text-sm text-gray-500 mt-1">
        {(stats.etiquetasDuplicadas / stats.totalEstoque * 100).toFixed(1)}% do total em etiquetas extras
      </p>
    </div>

    {/* <div>
      <div className="flex items-center gap-2 mb-1">
        <Package className="h-4 w-4 text-purple-500" />
        <p className="text-xs md:text-sm font-medium text-gray-500">
          Em Estoque Sem Etiqueta
        </p>
      </div>
      <p className="text-2xl md:text-3xl font-medium text-gray-900">
        {stats.emStkSemEtiq.toLocaleString()}
      </p>
      <p className="text-xs md:text-sm text-gray-500 mt-1">
        {(stats.emStkSemEtiq / stats.totalEstoque * 100).toFixed(1)}% do total em estoque
      </p>
    </div> */}

    <div>
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <p className="text-xs md:text-sm font-medium text-gray-500">
          Bind Sem Estoque
        </p>
      </div>
      <p className="text-2xl md:text-3xl font-medium text-gray-900">
        {stats.bindSemStk.toLocaleString()}
      </p>
      <p className="text-xs md:text-sm text-gray-500 mt-1">
        Produtos vinculados sem estoque
      </p>
    </div>

    <div>
      <div className="flex items-center gap-2 mb-1">
        <Barcode className="h-4 w-4 text-green-500" />
        <p className="text-xs md:text-sm font-medium text-gray-500">
          SKUs Etiquetados
        </p>
      </div>
      <p className="text-2xl md:text-3xl font-medium text-gray-900">
        {stats.skuetiquetados.toLocaleString()}
      </p>
      <p className="text-xs md:text-sm text-gray-500 mt-1">
        Total de SKUs com etiquetas
      </p>
    </div>
  </div>
</div>
                </div>
        
                <div className="text-center text-xs md:text-sm text-gray-500 mt-1">
                Última atualização: {formatLastUpdate(lastUpdate)}
                {lastUpdateDuration && ` (Tempo de atualização: ${lastUpdateDuration.toFixed(1)}s)`}
                {lastUpdate && (
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="ml-4 text-red-500 hover:text-red-800 underline"
                  >
                    Limpar cache
                  </button>
                )}
              </div>
              </div>
            </div>
          );
        };
        
        export default DashboardEtiquetas;