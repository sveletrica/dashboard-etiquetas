import React, { useState, useEffect, useCallback } from 'react';
import { BarChart as BarChartRecharts, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { 
  Package, 
  Tags, 
  AlertCircle, 
  BarChart2, 
  Info, 
  RotateCw 
} from 'lucide-react';

const CACHE_KEY = 'dashboard_etiquetas_cache';
const CACHE_TIMESTAMP_KEY = 'dashboard_etiquetas_last_update';
const CACHE_DURATION_KEY = 'dashboard_etiquetas_update_duration';

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

const DashboardEtiquetas = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingTime, setLoadingTime] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastUpdateDuration, setLastUpdateDuration] = useState(null);

  const saveToCache = useCallback((data, timestamp, duration) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toISOString());
      localStorage.setItem(CACHE_DURATION_KEY, duration.toString());
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }, []);

  const loadFromCache = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const cachedDuration = localStorage.getItem(CACHE_DURATION_KEY);

      if (cachedData && cachedTimestamp) {
        setStats(JSON.parse(cachedData));
        setLastUpdate(new Date(cachedTimestamp));
        setLastUpdateDuration(parseFloat(cachedDuration));
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
    }
    return false;
  }, []);

  const clearLoadingTimer = useCallback(() => {
    setLoadingTime(0);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingTime(0);
      const startTime = Date.now();

      const response = await fetch('https://n8n.sveletrica.com/webhook/code');
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }
      const data = await response.json();
      
      const processedData = {
        totalEstoque: data.totalEstoque || 0,
        produtosEtiquetados: data.produtosEtiquetados || 0,
        produtosSemEtiqueta: data.produtosSemEtiqueta || 0,
        produtosMultiplasEtiquetas: data.produtosMultiplasEtiquetas || 0,
        etiquetasDuplicadas: data.etiquetasDuplicadas || 0
      };

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const timestamp = new Date();

      setStats(processedData);
      setLastUpdate(timestamp);
      setLastUpdateDuration(duration);
      setError(null);

      saveToCache(processedData, timestamp, duration);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      clearLoadingTimer();
    }
  }, [saveToCache, clearLoadingTimer]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const hasCache = loadFromCache();
    if (!hasCache) {
      fetchData();
    }
  }, [fetchData, loadFromCache]);

  // Efeito para o contador de loading
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
      value: stats.produtosEtiquetados - stats.produtosMultiplasEtiquetas,
      percentual: ((stats.produtosEtiquetados - stats.produtosMultiplasEtiquetas) / stats.totalEstoque * 100).toFixed(1)
    },
    {
      name: 'Múltiplas Etiquetas',
      value: stats.produtosMultiplasEtiquetas,
      percentual: (stats.produtosMultiplasEtiquetas / stats.totalEstoque * 100).toFixed(1)
    },
    {
      name: 'Sem Etiqueta',
      value: stats.produtosSemEtiqueta,
      percentual: (stats.produtosSemEtiqueta / stats.totalEstoque * 100).toFixed(1)
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
            <img
              src="/logo-sv.png" // Adicione a logo da empresa na pasta public
              alt="Logo SV"
              className="h-20 w-auto"
            />
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Etiquetas Sobral</h1>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? `Atualizando... (${loadingTime}s)` : 'Atualizar dados'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-blue-500" />
              <p className="text-sm font-medium text-gray-500">Total em Estoque</p>
            </div>
            <p className="text-2xl md:text-3xl font-medium text-gray-900">{stats.totalEstoque.toLocaleString()}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">produtos cadastrados</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Tags className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium text-gray-500">Produtos Etiquetados</p>
            </div>
            <p className="text-2xl md:text-3xl font-medium text-gray-900">{stats.produtosEtiquetados.toLocaleString()}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              {(stats.produtosEtiquetados / stats.totalEstoque * 100).toFixed(1)}% do total
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium text-gray-500">Pendentes</p>
            </div>
            <p className="text-2xl md:text-3xl font-medium text-gray-900">{stats.produtosSemEtiqueta.toLocaleString()}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              {(stats.produtosSemEtiqueta / stats.totalEstoque * 100).toFixed(1)}% do total
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm h-[400px]">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              <h2 className="text-base md:text-lg font-medium text-gray-900">Distribuição de Etiquetas</h2>
            </div>
            <div className="h-[calc(100%-2rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChartRecharts data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                    height={50}
                    interval={0}
                    //angle={-45}
                    //textAnchor="end"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
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

          <div className="bg-white p-4 rounded-2xl shadow-sm h-[400px]">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-blue-500" />
              <h2 className="text-base md:text-lg font-medium text-gray-900">Detalhes Adicionais</h2>
            </div>
            <div className="space-y-6 h-[calc(100%-2rem)] flex flex-col justify-center">
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
            </div>
          </div>
        </div>

        <div className="text-center text-xs md:text-sm text-gray-500 mt-auto">
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