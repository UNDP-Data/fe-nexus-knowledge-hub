import type { AnyRootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

export default function createAddReportRoute(parentRoute: AnyRootRoute) {
  return createRoute({
    path: '/add-report',
    getParentRoute: () => parentRoute,
  }).lazy(() => import('./addReport.lazy').then((d) => d.Route));
}
