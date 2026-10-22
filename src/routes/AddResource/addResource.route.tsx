import type { AnyRootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

export default function createAddReportRoute(parentRoute: AnyRootRoute) {
  return createRoute({
    path: '/add-resource',
    getParentRoute: () => parentRoute,
  }).lazy(() => import('./addResource.lazy').then((d) => d.Route));
}
