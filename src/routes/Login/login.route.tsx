import type { AnyRootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

export default function createLoginRoute(parentRoute: AnyRootRoute) {
  return createRoute({
    path: '/login',
    getParentRoute: () => parentRoute,
  }).lazy(() => import('./login.lazy').then((d) => d.Route));
}
