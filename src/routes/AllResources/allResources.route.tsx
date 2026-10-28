import type { AnyRootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';
import { metaDataDefinition } from '@/utils/metaDataDefinition';

export default function createAllReportsRoute(parentRoute: AnyRootRoute) {
  return createRoute({
    path: '/all-resources',
    getParentRoute: () => parentRoute,
    head: () => ({
      meta: metaDataDefinition({
        title: 'Nexus Knowledge Hub | All resources',
        description:
          'Browse all reports, guidance and tools across humanitarian, development and peace.',
        path: '/all-resources',
      }),
    }),
  }).lazy(() => import('./allResources.lazy').then((d) => d.Route));
}
