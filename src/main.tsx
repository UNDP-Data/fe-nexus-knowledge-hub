import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FooterEl from './components/Footer';
import HeaderEl from './components/Header';
import * as TanStackQueryProvider from './integration/tanstack-query';
import createAllReportsRoute from './routes/AllReports/allReports.route';

import './styles/fonts.css';
import './styles/style.css';
import createAddReportRoute from './routes/AddReport/addReport.route';

const rootRoute = createRootRoute({
  component: () => (
    <div className='flex min-h-screen flex-col gap-0'>
      <HeaderEl />
      <main className='flex grow flex-col justify-center'>
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
  createAllReportsRoute(rootRoute),
  createAddReportRoute(rootRoute),
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
