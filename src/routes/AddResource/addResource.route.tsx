import type { AnyRootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';
import { metaDataDefinition } from '@/utils/metaDataDefinition';

export default function createAddReportRoute(parentRoute: AnyRootRoute) {
  return createRoute({
    path: '/add-resource',
    getParentRoute: () => parentRoute,
    head: () => ({
      meta: metaDataDefinition({
        title: 'Nexus Knowledge Hub | Add resource',
        description: 'Add a report, guidance or tools across humanitarian, development and peace.',
        path: '/add-resource',
      }),
    }),
  }).lazy(() => import('./addResource.lazy').then((d) => d.Route));
}
