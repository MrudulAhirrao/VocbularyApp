'use client';

import { Provider } from 'react-redux';
import { store } from '../lib/store';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'; 

const theme = createTheme({
  typography: { fontFamily: '"Kumbh Sans", sans-serif' },
  palette: {
    primary: { main: '#5D1049' },
    secondary: { main: '#E30425' },
    background: { default: '#F4F4F4' },
  },
  components: {
    MuiAppBar: { styleOverrides: { root: { backgroundColor: '#5D1049', boxShadow: 'none' } } },
    MuiFab: { styleOverrides: { root: { backgroundColor: '#E30425', '&:hover': { backgroundColor: '#B0001D' } } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } } }
  },
});

const client = new ApolloClient({
  link: new HttpLink({ uri: '/api/graphql' }),
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 2. Wrap everything with AppRouterCacheProvider
    <AppRouterCacheProvider>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ApolloProvider>
      </Provider>
    </AppRouterCacheProvider>
  );
}