# Dashboard de Etiquetas - SV Elétrica

Dashboard para monitoramento de etiquetas de produtos e consulta de estoque nas filiais da SV Elétrica, desenvolvido com React e Tailwind CSS.

## Funcionalidades

- Visualização em tempo real do status das etiquetas
- Suporte para múltiplas filiais (Sobral, Maracanaú, Caucaia)
- Gráficos de distribuição de etiquetas
- Métricas detalhadas por filial
- Sistema de cache local para melhor performance
- Consulta avançada de estoque com filtros e exportação
- Interface responsiva
- Design moderno e intuitivo com fonte personalizada Allotrope

## Tecnologias Utilizadas

- React 18
- Tailwind CSS
- React Router Dom
- Recharts (gráficos)
- Lucide React (ícones)
- TanStack Table (tabelas)
- React Hot Toast (notificações)
- XLSX (exportação para Excel)
- PrimeReact (componentes UI)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/dashboard-etiquetas.git
```

2. Entre no diretório do projeto
```bash
cd dashboard-etiquetas
```

3. Instale as dependências
```bash
npm install
```

4. Execute o projeto
```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
src/
  ├── components/          # Componentes reutilizáveis
  │   └── DashboardEtiquetas/  # Componente principal do dashboard
  │
  ├── config/             # Configurações
  │   └── filiais.js      # Configuração das filiais
  │
  ├── layouts/            # Layouts compartilhados
  │   └── MainLayout.js   # Layout principal com sidebar
  │
  ├── pages/              # Páginas da aplicação
  │   ├── Home/           # Página inicial
  │   ├── Sobral/        # Dashboard Sobral
  │   ├── Maracanau/     # Dashboard Maracanaú
  │   ├── Caucaia/       # Dashboard Caucaia
  │   ├── Reports/       # Página de relatórios
  │   ├── ItensSemEtiqueta/  # Listagem de itens sem etiqueta
  │   └── ConsultaEstoque/   # Sistema de consulta de estoque
  │       ├── components/    # Componentes da consulta
  │       │   ├── LoadingState.js
  │       │   ├── TableHeader.js
  │       │   └── TableColumns.js
  │       ├── hooks/        # Hooks personalizados
  │       │   ├── useTableData.js
  │       │   └── useExportData.js
  │       └── utils/        # Utilitários
  │           ├── constants.js
  │           └── tableHelpers.js
  │
  ├── styles/             # Estilos globais
  │   ├── index.css      # Estilos Tailwind e fonte Allotrope
  │   └── App.css        # Estilos específicos da aplicação
  │
  ├── App.js             # Componente principal e rotas
  └── index.js           # Ponto de entrada da aplicação

public/                  # Arquivos públicos
  ├── index.html         # HTML principal
  ├── manifest.json      # Manifesto PWA
  └── robots.txt         # Configurações para crawlers
```

## Configuração

Para configurar novas filiais ou alterar webhooks existentes, edite o arquivo `src/config/filiais.js`:

```javascript
export const FILIAIS = {
  SOBRAL: {
    id: 'sobral',
    nome: 'Sobral',
    webhook: 'https://seu-webhook-sobral',
  },
  // ... outras filiais
};
```

## Cache

O sistema utiliza localStorage para cache, com chaves específicas para cada filial:
- `dashboard_etiquetas_cache_{filial}`
- `dashboard_etiquetas_last_update_{filial}`
- `dashboard_etiquetas_update_duration_{filial}`

## Deployment

O projeto está configurado para deploy automático na Vercel. Cada push para a branch main dispara um novo deploy.

## Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Cria a versão de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejeta as configurações do Create React App

## Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é propriedade da SV Elétrica.

## Suporte

Para suporte, entre em contato com a equipe de desenvolvimento da SV Elétrica.

## Autores

- Desenvolvido pela equipe de TI da SV Elétrica

## Status do Projeto

Em desenvolvimento ativo 🚀

## Configuração do Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Ajuste as variáveis de ambiente no arquivo `.env` conforme necessário:
```env
REACT_APP_API_BASE_URL=https://sua-api.com
# ... outras variáveis
```