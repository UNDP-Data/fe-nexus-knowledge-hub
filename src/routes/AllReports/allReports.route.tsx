import type { AnyRootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

export default function createAllReportsRoute(parentRoute: AnyRootRoute) {
  return createRoute({
    path: '/all-reports',
    getParentRoute: () => parentRoute,
  }).lazy(() => import('./allReports.lazy').then((d) => d.Route));
}
