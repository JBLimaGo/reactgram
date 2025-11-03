# Copilot Instructions for ReactGram

## Visão Geral da Arquitetura
- O projeto é dividido em dois principais diretórios: `frontend/` (React) e `backend/` (Node.js + Express + Mongoose).
- O backend expõe APIs REST para autenticação, upload de fotos e gerenciamento de usuários, utilizando MongoDB via Mongoose.
- O frontend consome essas APIs e implementa a interface do usuário usando Redux para gerenciamento de estado.

## Fluxos de Trabalho Essenciais
### Backend
- Para iniciar o backend, execute `npm install` e `npm start` dentro de `backend/`.
- O arquivo principal é `backend/app.js`. Rotas estão em `backend/routes/`, controladores em `backend/controllers/`.
- Uploads de imagens são salvos em `backend/uploads/photos/`.
- Validações e autenticação são feitas por middlewares em `backend/middlewares/`.
- O banco de dados é configurado em `backend/config/db.js`.

### Frontend
- Para iniciar o frontend, execute `npm install` e `npm start` dentro de `frontend/`.
- O ponto de entrada é `frontend/src/index.js`. Componentes principais estão em `frontend/src/components/`.
- O estado global é gerenciado via Redux, configurado em `frontend/src/store.js`.
- Serviços de API estão em `frontend/src/services/`.
- Slices do Redux ficam em `frontend/src/slices/`.

## Convenções Específicas
- Controllers devem ser nomeados como `*Controller.js` e conter apenas lógica de negócio e manipulação de requisições.
- Middlewares devem ser usados para validação, autenticação e upload de arquivos.
- Models do Mongoose ficam em `backend/models/` e seguem o padrão de schema do MongoDB.
- As rotas devem ser agrupadas por recurso (ex: `PhotoRoutes.js`, `UserRoutes.js`).
- No frontend, componentes são funcionais e organizados por domínio em `components/`, `pages/`, e hooks customizados em `hooks/`.

## Integrações e Dependências
- Backend depende de `express`, `mongoose`, `jsonwebtoken`, `multer` (upload), e outros pacotes Node.js.
- Frontend depende de `react`, `redux`, `react-redux`, `axios` (requisições HTTP), e outros pacotes do ecossistema React.
- Comunicação entre frontend e backend é feita via chamadas HTTP para endpoints REST.

## Exemplos de Padrões
- Para criar uma rota protegida:
  ```js
  const { authGuard } = require('../middlewares/authGuard');
  router.post('/photos', authGuard, PhotoController.createPhoto);
  ```
- Para consumir uma API no frontend:
  ```js
  import api from '../services/api';
  const response = await api.get('/photos');
  ```

## Observações
- Sempre valide dados de entrada usando middlewares antes de persistir no banco.
- Imagens são salvas localmente em `backend/uploads/photos/` e referenciadas por URL no banco.
- Para testes, utilize os scripts padrão do Create React App no frontend e configure testes no backend conforme necessário.

---

Seções incompletas ou dúvidas sobre fluxos específicos? Solicite exemplos ou detalhes para aprimorar este guia.