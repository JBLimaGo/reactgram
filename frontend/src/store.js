import {configureStore} from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {      
    auth: authReducer, // Adiciona o reducer de autenticação 
    user: userReducer, // Adiciona o reducer de usuário
    // Aqui você pode adicionar os reducers do seu aplicativo
    // Exemplo: user: userReducer,
  },    
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false, // Desabilita a verificação de serialização
        }),
    devTools: process.env.NODE_ENV !== 'production', // Habilita o DevTools apenas em desenvolvimento
    preloadedState: {}, // Estado inicial do Redux
});