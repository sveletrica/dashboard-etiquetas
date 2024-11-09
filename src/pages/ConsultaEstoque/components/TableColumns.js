import React from 'react';

export const useTableColumns = () => {
    return [
        {
            header: 'Código',
            accessorKey: 'CdChamada',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="font-mono">
                    {info.getValue() || '-'}
                </div>
            ),
        },
        {
            header: 'Produto',
            accessorKey: 'NmProduto',
            size: 300,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="truncate" title={info.getValue()}>
                    {info.getValue() || '-'}
                </div>
            ),
        },
        {
            header: 'Grupo',
            accessorKey: 'NmGrupoProduto',
            size: 150,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="truncate" title={info.getValue()}>
                    {info.getValue() || '-'}
                </div>
            ),
        },
        {
            header: 'Família',
            accessorKey: 'NmFamiliaProduto',
            size: 150,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="truncate" title={info.getValue()}>
                    {info.getValue() || '-'}
                </div>
            ),
        },
        {
            header: 'Matriz',
            accessorKey: 'QtEstoque_Empresa1',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono">
                    {info.getValue()?.toLocaleString() || '0'}
                </div>
            ),
        },
        {
            header: 'CD',
            accessorKey: 'QtEstoque_Empresa4',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono">
                    {info.getValue()?.toLocaleString() || '0'}
                </div>
            ),
        },
        {
            header: 'Exp BM',
            accessorKey: 'QtEstoque_Empresa12',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono">
                    {info.getValue()?.toLocaleString() || '0'}
                </div>
            ),
        },
        {
            header: 'Exp WS',
            accessorKey: 'QtEstoque_Empresa59',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono">
                    {info.getValue()?.toLocaleString() || '0'}
                </div>
            ),
        },
        {
            header: 'Exp Maracanau',
            accessorKey: 'QtEstoque_Empresa13',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono">
                    {info.getValue()?.toLocaleString() || '0'}
                </div>
            ),
        },
        {
            header: 'Juazeiro',
            accessorKey: 'QtEstoque_Empresa15',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono">
                    {info.getValue()?.toLocaleString() || '0'}
                </div>
            ),
        },
        {
            header: 'Exp Sobral',
            accessorKey: 'QtEstoque_Empresa17',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono">
                    {info.getValue()?.toLocaleString() || '0'}
                </div>
            ),
        },
        {
            header: 'Total',
            accessorKey: 'StkTotal',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono font-semibold">
                    {info.getValue()?.toLocaleString() || '0'}
                </div>
            ),
        },
        {
            header: 'Preço',
            accessorKey: 'VlPreco_Empresa59',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono">
                    {info.getValue()
                        ? info.getValue().toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })
                        : '-'
                    }
                </div>
            ),
        },
        {
            header: 'Promoção',
            accessorKey: 'PrecoPromo',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className={`text-right font-mono ${info.getValue() ? 'text-green-600 font-medium' : ''}`}>
                    {info.getValue()
                        ? info.getValue().toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })
                        : '-'
                    }
                </div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'StatusPromo',
            size: 80,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => {
                const status = info.getValue();
                let colorClass = 'text-gray-500';
                if (status === 'ATIVO') colorClass = 'text-green-600 font-medium';
                if (status === 'INATIVO') colorClass = 'text-red-600';

                return (
                    <div className={`text-center ${colorClass}`}>
                        {status || '-'}
                    </div>
                );
            },
        },
        {
            header: 'Preço De',
            accessorKey: 'PrecoDe',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-right font-mono text-gray-500 line-through">
                    {info.getValue()
                        ? info.getValue().toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })
                        : '-'
                    }
                </div>
            ),
        },
        {
            header: 'Início',
            accessorKey: 'DataInicio',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-center">
                    {info.getValue()
                        ? new Date(info.getValue()).toLocaleDateString('pt-BR')
                        : '-'
                    }
                </div>
            ),
        },
        {
            header: 'Fim',
            accessorKey: 'DataFim',
            size: 100,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-center">
                    {info.getValue()
                        ? new Date(info.getValue()).toLocaleDateString('pt-BR')
                        : '-'
                    }
                </div>
            ),
        },
        {
            header: 'Sigla',
            accessorKey: 'CdSigla',
            size: 80,
            enableSorting: true,
            enableFiltering: true,
            isVisible: true, // Ensure this is set to true
            cell: (info) => (
                <div className="text-center font-mono">
                    {info.getValue()?.trim() || '-'}
                </div>
            ),
        },
    ];
};