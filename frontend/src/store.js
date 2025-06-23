import {configureStore} from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {    
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