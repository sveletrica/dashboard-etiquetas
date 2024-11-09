import React, { useState, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Toaster } from 'react-hot-toast';

// Components
import { TableHeader } from './components/TableHeader';
import { LoadingState } from './components/LoadingState';

// Hooks
import { useTableData } from './hooks/useTableData';
import { useExportData } from './hooks/useExportData';
import { useTableColumns } from './components/TableColumns';

const NUMERIC_COLUMNS = [
  'QtEstoque_Empresa1', 
  'QtEstoque_Empresa4', 
  'QtEstoque_Empresa12', 
  'QtEstoque_Empresa59', 
  'QtEstoque_Empresa13', 
  'QtEstoque_Empresa15', 
  'QtEstoque_Empresa17', 
  'StkTotal'
];

const normalizeText = (text) => {
  return text
    ?.toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
};

const fuzzyTextFilter = (row, columnId, filterValue) => {
  const searchTerms = normalizeText(filterValue).split(' ').filter(Boolean);

  if (searchTerms.length === 0) return true;

  if (columnId === 'global') {
    const searchableColumns = ['NmProduto', 'CdChamada', 'NmGrupoProduto', 'NmFamiliaProduto'];
    return searchTerms.every(term =>
      searchableColumns.some(column => {
        const cellValue = normalizeText(row.getValue(column));
        return cellValue?.includes(term);
      })
    );
  }

  const cellValue = normalizeText(row.getValue(columnId));
  return searchTerms.every(term => cellValue?.includes(term));
};

const highlightMatch = (text, searchTerms) => {
  if (!searchTerms || searchTerms.length === 0 || !text) return text;

  let result = text.toString(); // Ensure result is a string

  searchTerms.forEach(term => {
    const normalizedTerm = normalizeText(term);
    const regex = new RegExp(`(${normalizedTerm})`, 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  });

  return <div dangerouslySetInnerHTML={{ __html: result }} />;
};

const parseFilterValue = (filterValue) => {
  const match = filterValue.match(/(>=|<=|>|<|=)?\s*(\d+)/);
  if (match) {
    const [, operator, number] = match;
    return { operator: operator || '=', number: parseInt(number, 10) };
  }
  return null;
};

const applyNumericFilter = (row, columnId, filterValue) => {
  const parsedFilter = parseFilterValue(filterValue);
  if (!parsedFilter) return true;

  const { operator, number } = parsedFilter;
  const cellValue = Number(row.getValue(columnId));

  if (isNaN(cellValue)) return false;

  switch (operator) {
    case '>':
      return cellValue > number;
    case '<':
      return cellValue < number;
    case '>=':
      return cellValue >= number;
    case '<=':
      return cellValue <= number;
    case '=':
    default:
      return cellValue === number;
  }
};

const addColumnFeatures = (column) => {
  if (NUMERIC_COLUMNS.includes(column.accessorKey)) {
    return {
      ...column,
      isVisible: true,
      filterFn: applyNumericFilter
    };
  }

  return {
    ...column,
    isVisible: true,
    filterFn: fuzzyTextFilter,
    cell: info => {
      const value = info.getValue();
      const filterValue = info.table.getState().globalFilter;
      if (!filterValue) return value;

      const searchTerms = normalizeText(filterValue).split(' ').filter(Boolean);
      return highlightMatch(value, searchTerms);
    }
  };
};

const ConsultaEstoque = () => {
  const defaultColumns = useTableColumns();
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  
  const [columns, setColumns] = useState(() => {
    try {
      const savedColumns = localStorage.getItem('tableColumns');
      if (savedColumns) {
        const parsedColumns = JSON.parse(savedColumns);
        return defaultColumns.map(defaultColumn => {
          const savedColumn = parsedColumns.find(
            col => col.accessorKey === defaultColumn.accessorKey
          );
          return savedColumn 
            ? { ...addColumnFeatures(defaultColumn), isVisible: savedColumn.isVisible }
            : addColumnFeatures(defaultColumn);
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações das colunas:', error);
    }
    return defaultColumns.map(addColumnFeatures);
  });

  const parentRef = useRef();
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const {
    data,
    loading,
    loadingProgress,
    lastUpdate,
    fetchData: originalFetchData,
  } = useTableData();

  const fetchData = () => {
    const cacheDuration = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();

    if (!lastFetchTime || now - lastFetchTime > cacheDuration) {
      originalFetchData();
      setLastFetchTime(now);
    }
  };

  const exportToExcel = useExportData(data);

  const table = useReactTable({
    data,
    columns: columns.filter(col => col.isVisible !== false),
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyTextFilter,
    filterFns: {
      fuzzy: fuzzyTextFilter,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 0,
    overscan: 20,
  });

  const handleClearFilters = (newFilters = []) => {
    setColumnFilters(newFilters);
    if (newFilters.length === 0) {
      setGlobalFilter('');
    }
  };

  if (loading && !data.length) {
    return <LoadingState progress={loadingProgress} />;
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="p-4 md:p-6 max-w-[1920px] mx-auto flex-grow flex flex-col">
          <TableHeader
            lastUpdate={lastUpdate}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            loading={loading}
            onRefresh={fetchData}
            onExport={exportToExcel}
            totalRegistros={data.length}
            columnFilters={columnFilters}
            onClearFilters={handleClearFilters}
            columns={columns}
            setColumns={setColumns}
          />

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex-grow">
            <div 
              ref={parentRef} 
              style={{ height: 'calc(100vh - 230px)' }} 
              className="overflow-auto"
            >
              <table className="w-full border-collapse table-auto">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          style={{ width: header.column.columnDef.size }}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                        >
                          <div
                            className={`flex items - center gap - 2 ${
  header.column.getCanSort() ? 'cursor-pointer select-none' : ''
} `}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {{
                                  asc: '↑',
                                  desc: '↓',
                                }[header.column.getIsSorted()] ?? '↕'}
                              </span>
                            )}
                          </div>
                          {header.column.getCanFilter() && (
                            <div className="mt-2">
                              <input
                                type="text"
                                value={header.column.getFilterValue() ?? ''}
                                onChange={e => header.column.setFilterValue(e.target.value)}
                                placeholder={NUMERIC_COLUMNS.includes(header.column.id) ? "Ex: >=10" : "Filtrar..."}
                                className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500"
                              />
                              {NUMERIC_COLUMNS.includes(header.column.id) && (
                                <div className="hidden group-hover:block absolute left-0 -bottom-12 z-50 bg-gray-800 text-white p-2 rounded text-xs whitespace-nowrap">
                                  Operadores: &gt;, &lt;, &gt;=, &lt;=, = (Ex: &gt;=10)
                                </div>
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {rowVirtualizer.getVirtualItems().map(virtualRow => {
                    const row = rows[virtualRow.index];
                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50"
                        style={{
                          height: `${ virtualRow.size } px`,
                          transform: `translateY(${ virtualRow.start }px)`,
                        }}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td
                            key={cell.id}
                            className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200 truncate"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 px-4 py-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-sm text-gray-700">
                    Total: <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> itens
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-sm text-gray-700 hover:text-gray-900"
                    onClick={() => handleClearFilters()}
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between fixed bottom-0 left-0 right-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                {'<'}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                {'>>'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Página{' '}
                <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span>{' '}
                de{' '}
                <span className="font-medium">{table.getPageCount()}</span>
              </span>
              <span className="text-sm text-gray-700">
                | Total: {data.length} itens
              </span>
            </div>
          </div>
        

          {loading && data.length > 0 && (
            <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-gray-600">Atualizando dados...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultaEstoque;
