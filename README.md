# Dashboard de Etiquetas - SV Elétrica

Dashboard para monitoramento de etiquetas de produtos nas filiais da SV Elétrica, desenvolvido com React e Tailwind CSS.

## Funcionalidades

- Visualização em tempo real do status das etiquetas
- Suporte para múltiplas filiais (Sobral, Maracanaú, Caucaia)
- Gráficos de distribuição
- Métricas detalhadas por filial
- Cache local para melhor performance
- Interface responsiva
- Design moderno e intuitivo

## Tecnologias Utilizadas

- React 18
- Tailwind CSS
- React Router Dom
- Recharts (gráficos)
- Lucide React (ícones)

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
  ├── components/     # Componentes reutilizáveis
  │   └── DashboardEtiquetas/  # Componente principal do dashboard
  ├── config/        # Configurações
  │   └── filiais.js # Configuração das filiais
  ├── layouts/       # Layouts compartilhados
  │   └── MainLayout.js
  ├── pages/         # Páginas da aplicação
  │   ├── Home/
  │   ├── Sobral/
  │   ├── Maracanau/
  │   └── Caucaia/
  ├── App.js
  └── index.js
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