import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

export const useExportData = (data) => {
    return useCallback(() => {
        try {
            toast.loading('Preparando arquivo para exportação...', { duration: 2000 });
            console.log('Iniciando exportação de dados:', { registros: data.length });

            // Verifica se há dados para exportar
            if (!data || data.length === 0) {
                toast.error('Não há dados para exportar');
                return;
            }

            // Preparar os dados para exportação com formatação
            const exportData = data.map((item, index) => {
                try {
                    return {
                        'Código': item.CdChamada,
                        'Produto': item.NmProduto,
                        'Grupo': item.NmGrupoProduto,
                        'Família': item.NmFamiliaProduto,
                        'Matriz': Number(item.QtEstoque_Empresa1 || 0).toLocaleString('pt-BR'),
                        'CD': Number(item.QtEstoque_Empresa4 || 0).toLocaleString('pt-BR'),
                        'Exp BM': Number(item.QtEstoque_Empresa12 || 0).toLocaleString('pt-BR'),
                        'Exp WS': Number(item.QtEstoque_Empresa59 || 0).toLocaleString('pt-BR'),
                        'Exp Maracanau': Number(item.QtEstoque_Empresa13 || 0).toLocaleString('pt-BR'),
                        'Juazeiro': Number(item.QtEstoque_Empresa15 || 0).toLocaleString('pt-BR'),
                        'Exp Sobral': Number(item.QtEstoque_Empresa17 || 0).toLocaleString('pt-BR'),
                        'Total': Number(item.StkTotal || 0).toLocaleString('pt-BR'),
                        'Preço': item.VlPreco_Empresa59
                            ? Number(item.VlPreco_Empresa59).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })
                            : '-',
                        'Promoção': item.PrecoPromo
                            ? Number(item.PrecoPromo).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })
                            : '-',
                        'Status': item.StatusPromo || '-',
                        'Preço De': item.PrecoDe
                            ? Number(item.PrecoDe).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })
                            : '-',
                        'Início': item.DataInicio
                            ? new Date(item.DataInicio).toLocaleDateString('pt-BR')
                            : '-',
                        'Fim': item.DataFim
                            ? new Date(item.DataFim).toLocaleDateString('pt-BR')
                            : '-',
                        'Sigla': item.CdSigla || '-'
                    };
                } catch (itemError) {
                    console.error(`Erro ao processar item ${index}:`, itemError);
                    return null;
                }
            }).filter(Boolean); // Remove itens que falharam no processamento

            // Criar a planilha
            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // Configurar larguras das colunas
            const columnWidths = [
                { wch: 12 },  // Código
                { wch: 50 },  // Produto
                { wch: 25 },  // Grupo
                { wch: 25 },  // Família
                { wch: 10 },  // Matriz
                { wch: 10 },  // CD
                { wch: 10 },  // Exp BM
                { wch: 10 },  // Exp WS
                { wch: 10 },  // Exp Maracanau
                { wch: 10 },  // Juazeiro
                { wch: 10 },  // Exp Sobral
                { wch: 10 },  // Total
                { wch: 15 },  // Preço
                { wch: 15 },  // Promoção
                { wch: 10 },  // Status
                { wch: 15 },  // Preço De
                { wch: 12 },  // Início
                { wch: 12 },  // Fim
                { wch: 8 },   // Sigla
            ];

            worksheet['!cols'] = columnWidths;

            // Estilização das células
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cell_address = { c: C, r: R };
                    const cell_ref = XLSX.utils.encode_cell(cell_address);

                    if (!worksheet[cell_ref]) continue;

                    // Estilo do cabeçalho
                    if (R === 0) {
                        worksheet[cell_ref].s = {
                            font: { bold: true },
                            fill: { fgColor: { rgb: "EFEFEF" } },
                            alignment: { vertical: "center", horizontal: "center" }
                        };
                    }
                    // Estilo das células
                    else {
                        worksheet[cell_ref].s = {
                            alignment: {
                                vertical: "center",
                                horizontal: C >= 4 && C <= 11 ? "right" : "left" // Alinhamento à direita para colunas numéricas
                            }
                        };
                    }
                }
            }

            // Criar o workbook e adicionar a planilha
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Consulta Estoque");

            // Nome do arquivo com data e hora
            const now = new Date();
            const fileName = `consulta-estoque_${now.toISOString().split('T')[0]}_${now.toTimeString().split(' ')[0].replace(/:/g, '-')
                }.xlsx`;

            // Gerar e baixar o arquivo
            try {
                XLSX.writeFile(workbook, fileName);
                console.log('Arquivo exportado com sucesso:', fileName);
                toast.success('Exportação concluída com sucesso!');
            } catch (writeError) {
                console.error('Erro ao salvar arquivo:', writeError);
                toast.error('Erro ao salvar o arquivo');
            }

        } catch (error) {
            console.error('Erro durante a exportação:', error);
            toast.error('Erro ao exportar dados');
        }
    }, [data]);
};