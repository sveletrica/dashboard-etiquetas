import React, { useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { Download, ArrowLeft, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const ItensSemEtiqueta = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const navigate = useNavigate();
    const { filialId } = useParams();

    const columns = [
        {
            header: 'Código',
            accessorKey: 'codigo',
            cell: (info) => info.getValue(),
        },
        {
            header: 'Produto',
            accessorKey: 'nome',
            cell: (info) => info.getValue(),
        },
        {
            header: 'Estoque',
            accessorKey: 'estoque',
            cell: (info) => info.getValue().toLocaleString(),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Exemplo de URL do webhook - ajuste conforme necessário
                const response = await fetch(`https://n8n.sveletrica.com/webhook/items-sem-etiqueta/${filialId}`);
                if (!response.ok) throw new Error('Erro ao carregar dados');
                const jsonData = await response.json();
                // Como o JSON já vem como array, podemos usar diretamente
                setData(jsonData);
            } catch (error) {
                toast.error('Erro ao carregar dados');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filialId]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 10, // Define quantos itens por página
            },
        },
    });

    const exportToExcel = () => {
        try {
            // Preparar os dados para exportação
            const exportData = data.map(item => ({
                'Código': item.codigo,
                'Produto': item.nome,
                'Estoque': item.estoque
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Itens Sem Etiqueta");

            // Ajustar largura das colunas
            const maxWidth = exportData.reduce((w, r) => Math.max(w, r.Produto.length), 10);
            worksheet['!cols'] = [
                { wch: 10 }, // Código
                { wch: maxWidth }, // Produto
                { wch: 10 }, // Estoque
            ];

            XLSX.writeFile(workbook, `itens-sem-etiqueta-${filialId}-${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Arquivo exportado com sucesso!');
        } catch (error) {
            toast.error('Erro ao exportar arquivo');
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-[1440px] mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Voltar
                    </button>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative">
                            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={globalFilter ?? ''}
                                onChange={e => setGlobalFilter(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-auto"
                                placeholder="Buscar..."
                            />
                        </div>
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full sm:w-auto justify-center"
                        >
                            <Download className="h-4 w-4" />
                            Exportar para Excel
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                        Itens em Estoque sem Etiqueta
                    </h1>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        {row.getVisibleCells().map(cell => (
                                            <td
                                                key={cell.id}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                </div>
            </div>
        </div>
    );
};

export default ItensSemEtiqueta;