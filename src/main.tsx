import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import * as TanStackQueryProvider from './integration/tanstack-query';
import HeaderEl from './components/Header';
import FooterEl from './components/Footer';
import App from './App';
import createTanStackQueryDemoRoute from './routes/queryDemo';

import './styles/fonts.css';
import './styles/style.css';

const rootRoute = createRootRoute({
  component: () => (
    <div className='flex flex-col gap-0 min-h-screen'>
      <HeaderEl />
      <main className='grow-1 flex flex-col justify-center'>
        <div className='flex flex-col justify-center'>
          <Outlet />
        </div>
      </main>
      <FooterEl />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  createTanStackQueryDemoRoute(rootRoute),
]);

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  );
}
