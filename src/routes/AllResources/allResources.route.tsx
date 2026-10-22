import type { AnyRootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

export default function createAllReportsRoute(parentRoute: AnyRootRoute) {
  return createRoute({
    path: '/all-resources',
    getParentRoute: () => parentRoute,
  }).lazy(() => import('./allResources.lazy').then((d) => d.Route));
}
