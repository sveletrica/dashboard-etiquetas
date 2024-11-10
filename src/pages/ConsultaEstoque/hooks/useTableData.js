import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CACHE_KEY, CACHE_TIMESTAMP_KEY } from '../utils/constants';

export const useTableData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [lastUpdateEstoque, setLastUpdateEstoque] = useState(null);

  const loadFromCache = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cachedData && cachedTimestamp) {
        const timestamp = new Date(cachedTimestamp);
        const now = new Date();
        const diffInMinutes = (now - timestamp) / (1000 * 60);

        // Cache válido por 30 minutos
        if (diffInMinutes < 30) {
          const parsedData = JSON.parse(cachedData);
          console.log('Carregando dados do cache...', {
            registros: parsedData.data.length,
            ultimaAtualizacao: parsedData.lastUpdate
          });
          
          setData(parsedData.data);
          setLastUpdateEstoque(parsedData.lastUpdate);
          setLoading(false);
          return true;
        } else {
          console.log('Cache expirado. Última atualização:', timestamp);
        }
      }
      return false;
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
      return false;
    }
  }, []);

  const saveToCache = useCallback((data, lastUpdate) => {
    try {
      const cacheData = {
        data,
        lastUpdate,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
      
      console.log('Dados salvos em cache:', {
        registros: data.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
      // Se houver erro ao salvar cache, tenta limpar o cache antigo
      try {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      } catch (clearError) {
        console.error('Erro ao limpar cache:', clearError);
      }
    }
  }, []);

  const simulateProgress = useCallback(() => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return Math.min(prev + 1, 90);
      });
    }, 100);
    return interval;
  }, []);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      // Se não for refresh forçado, tenta usar cache
      if (!forceRefresh) {
        const hasCachedData = loadFromCache();
        if (hasCachedData) {
          console.log('Usando dados do cache');
          return;
        }
      }

      setLoading(true);
      const progressInterval = simulateProgress();
      console.log('Iniciando busca de dados...');

      try {
          const response = await fetch('https://n8n.sveletrica.com/webhook/consultaestoque');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${ response.status } `);
        }

        const jsonData = await response.json();
        console.log('Dados recebidos:', jsonData);

        const processedData = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        const formattedData = processedData.map((item, index) => {
          try {
            return {
              id: index, // Adiciona um ID único para cada item
              CdChamada: item.CdChamada || '',
              NmProduto: item.NmProduto || '',
              NmGrupoProduto: item.NmGrupoProduto || '',
              NmFamiliaProduto: item.NmFamiliaProduto || '',
              QtEstoque_Empresa1: Number(item.QtEstoque_Empresa1 || 0),
              QtEstoque_Empresa4: Number(item.QtEstoque_Empresa4 || 0),
              QtEstoque_Empresa12: Number(item.QtEstoque_Empresa12 || 0),
              QtEstoque_Empresa59: Number(item.QtEstoque_Empresa59 || 0),
              QtEstoque_Empresa13: Number(item.QtEstoque_Empresa13 || 0),
              QtEstoque_Empresa15: Number(item.QtEstoque_Empresa15 || 0),
              QtEstoque_Empresa17: Number(item.QtEstoque_Empresa17 || 0),
              StkTotal: Number(item.StkTotal || 0),
              VlPreco_Empresa59: Number(item.VlPreco_Empresa59 || 0),
              PrecoPromo: item.PrecoPromo ? Number(item.PrecoPromo) : null,
              StatusPromo: item.StatusPromo || null,
              PrecoDe: item.PrecoDe ? Number(item.PrecoDe) : null,
              DataInicio: item.DataInicio || null,
              DataFim: item.DataFim || null,
              CdSigla: item.CdSigla ? item.CdSigla.trim() : ''
            };
          } catch (itemError) {
            console.error(`Erro ao processar item ${ index }: `, itemError, item);
            return null;
          }
        }).filter(Boolean); // Remove itens que falharam no processamento

        console.log('Dados formatados:', {
          total: formattedData.length,
          amostra: formattedData.slice(0, 2)
        });

        clearInterval(progressInterval);
        setLoadingProgress(100);

        setData(formattedData);
        setLastUpdateEstoque(jsonData[0]?.Atualizacao || new Date().toISOString());
        saveToCache(formattedData, jsonData[0]?.Atualizacao);

        toast.success(`${ formattedData.length } registros carregados`);

        // Pequeno delay para mostrar 100% antes de remover o loading
        setTimeout(() => {
          setLoading(false);
          setLoadingProgress(0);
        }, 500);

      } catch (fetchError) {
        throw new Error(`Erro na requisição: ${ fetchError.message } `);
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error(error.message || 'Erro ao carregar dados');
      setLoading(false);
      setLoadingProgress(0);
    }
  }, [loadFromCache, simulateProgress, saveToCache]);

  // Effect para carregar dados iniciais
  useEffect(() => {
    console.log('Iniciando carregamento inicial de dados...');
    fetchData();

    return () => {
      console.log('Componente desmontado - limpando estados');
    };
  }, [fetchData]);

  return {
    data,
    loading,
    loadingProgress,
    lastUpdateEstoque,
    fetchData: () => fetchData(true), // Força refresh ao chamar manualmente
    isLoading: loading,
    progress: loadingProgress,
  };
};
