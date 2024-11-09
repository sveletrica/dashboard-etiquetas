import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, RotateCw, Filter, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const TableHeader = ({
    lastUpdate,
    globalFilter,
    setGlobalFilter,
    loading,
    onRefresh,
    onExport,
    totalRegistros,
    columnFilters,
    onClearFilters,
    columns,
    setColumns,
}) => {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const configMenuRef = useRef(null);
    const configButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isConfigOpen &&
                configMenuRef.current &&
                !configMenuRef.current.contains(event.target) &&
                !configButtonRef.current.contains(event.target)) {
                setIsConfigOpen(false);
            }
        };

        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isConfigOpen) {
                setIsConfigOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isConfigOpen]);

    const formatLastUpdate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            toast.success('Pesquisa aplicada');
        }
    };

    const handleClearSearch = () => {
        setGlobalFilter('');
        toast.success('Pesquisa limpa');
    };

    const activeFiltersCount = columnFilters?.length || 0;

    const toggleColumnConfig = () => {
        setIsConfigOpen(!isConfigOpen);
    };

    const handleColumnToggle = (columnId) => {
        setColumns(prevColumns => {
            const newColumns = prevColumns.map((col) =>
                col.accessorKey === columnId
                    ? { ...col, isVisible: !col.isVisible }
                    : col
            );

            // Salva no localStorage
            try {
                localStorage.setItem('tableColumns', JSON.stringify(
                    newColumns.map(col => ({
                        accessorKey: col.accessorKey,
                        isVisible: col.isVisible
                    }))
                ));
            } catch (error) {
                console.error('Erro ao salvar configurações das colunas:', error);
                toast.error('Erro ao salvar configurações');
            }

            return newColumns;
        });
    };

    return (
        <div className="mb-6 bg-white rounded-2xl shadow-sm p-4">
            <div className="flex flex-col gap-4">
                {/* Linha superior com título e informações */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-semibold text-gray-900">Consulta de Estoque</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">
                                Última atualização: {formatLastUpdate(lastUpdate)}
                            </span>
                            <span className="text-sm text-gray-400">|</span>
                            <span className="text-sm text-gray-500">
                                Total: {totalRegistros?.toLocaleString()} registros
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Atualizar dados"
                        >
                            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Atualizando...' : 'Atualizar'}
                        </button>
                        <button
                            onClick={onExport}
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                            title="Exportar para Excel"
                        >
                            <Download className="h-4 w-4" />
                            Exportar
                        </button>
                    </div>
                </div>

                {/* Linha inferior com busca e filtros */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-2xl w-full">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                            placeholder="Buscar em todas as colunas..."
                        />
                        {globalFilter && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <span className="text-sm">Limpar</span>
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative">
                            <button
                                onClick={onClearFilters}
                                disabled={activeFiltersCount === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${activeFiltersCount > 0
                                        ? 'border-blue-500 text-blue-500 hover:bg-blue-50'
                                        : 'border-gray-300 text-gray-400'
                                    } transition-colors`}
                                title="Limpar filtros"
                            >
                                <Filter className="h-4 w-4" />
                                Filtros
                                {activeFiltersCount > 0 && (
                                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <button
                                ref={configButtonRef}
                                onClick={toggleColumnConfig}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                title="Configurar colunas"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Colunas
                            </button>
                            {isConfigOpen && (
                                <div
                                    ref={configMenuRef}
                                    className="absolute right-0 mt-2 bg-white shadow-lg p-4 rounded-lg z-20 min-w-[200px] border border-gray-200"
                                >
                                    <div className="max-h-[60vh] overflow-y-auto">
                                        {columns.map((column) => (
                                            <label
                                                key={column.accessorKey}
                                                className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer w-full"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={column.isVisible !== false}
                                                    onChange={() => handleColumnToggle(column.accessorKey)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-700 select-none flex-1">
                                                    {column.header}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicadores de filtros ativos */}
            {activeFiltersCount > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {columnFilters?.map((filter) => (
                        <div
                            key={filter.id}
                            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                            <span>{filter.id}:</span>
                            <span className="font-medium">{filter.value}</span>
                            <button
                                onClick={() => {
                                    const newFilters = columnFilters.filter(f => f.id !== filter.id);
                                    onClearFilters(newFilters);
                                }}
                                className="hover:text-blue-900"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => onClearFilters([])}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        Limpar todos
                    </button>
                </div>
            )}
        </div>
    );
};