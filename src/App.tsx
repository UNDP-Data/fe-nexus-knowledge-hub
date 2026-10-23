import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
  Banner,
  BannerBody,
  BannerBodyContent,
  BannerBodySidebar,
} from '@undp/design-system-react/Banner';
import { Button } from '@undp/design-system-react/Button';
import { Container } from '@undp/design-system-react/Container';
import { Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@undp/design-system-react/Drawer';
import { Grid, GridItem } from '@undp/design-system-react/Grid';
import { PageHeader, PageHeaderContent } from '@undp/design-system-react/PageHeader';
import { Spacer } from '@undp/design-system-react/Spacer';
import { Spinner } from '@undp/design-system-react/Spinner';
import { H1, H3, H4, P } from '@undp/design-system-react/Typography';
import { ResourceCard } from './components/ResourceCard';
import { ReportDetail } from './components/ResourceDetail';
import { CardSkeleton } from './components/Skeleton';
import { API_BASE } from './constants';
import type { PublicationsResponse } from './Types';

function useRecentReportData() {
  return useQuery({
    queryKey: ['get-recent-report'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/publications/recent?limit=5`);
      const data = (await response.json()) as PublicationsResponse;
      return data.items;
    },
  });
}

function App() {
  const { data, isLoading, isError } = useRecentReportData();
  return (
    <>
      <PageHeader
        backgroundImage='/imgs/home-page-banner.webp'
        contentMode='dark'
        variant='primary'
      >
        <PageHeaderContent className='w-full md:w-1/2'>
          <H1>Nexus Knowledge Hub</H1>
          <H4>
            A curated global repository of practical resources supporting operationalisation of the
            HDP Nexus.
          </H4>
        </PageHeaderContent>
      </PageHeader>
      <Banner
        backgroundColor='secondary'
        bodyGap='base'
        bodyMaxWidth='lg'
        padding='base'
        sidebarWidth='base'
      >
        <BannerBody>
          <BannerBodySidebar>
            <H3>What is it?</H3>
          </BannerBodySidebar>
          <BannerBodyContent>
            <P>
              A curated global repository of practical resources supporting operationalisation of
              the HDP Nexus. Featuring academic reports, case studies, institutional frameworks, and
              operational guidance, the Nexus Knowledge Hub (currently in Beta version) strengthens
              evidence-based learning and provides the Nexus Academy course participants with a
              one-stop-shop of actionable knowledge and tools.
            </P>
          </BannerBodyContent>
        </BannerBody>
      </Banner>
      <Spacer size='8xl' />
      <Container width='lg' className='m-auto'>
        {isLoading ? (
          <Spinner size='lg' className='mx-auto my-20' />
        ) : isError ? (
          'Error'
        ) : (
          <Grid
            gap='32px'
            noOfCol={{
              base: 1,
              md: 3,
              sm: 2,
            }}
          >
            <GridItem
              noOfColSpan={{
                base: 1,
                md: 1,
                sm: 1,
              }}
            >
              <H3 marginBottom='none'>Recent Resources</H3>
              <Spacer size='2xl' />
              <Button variant='link' padding='none'>
                <Link to='/all-resources'>View All Resources</Link>
              </Button>
            </GridItem>
            {isError
              ? 'Error'
              : isLoading || !data
                ? Array.from({ length: 5 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: index is unique
                    <CardSkeleton key={i} />
                  ))
                : data?.map((report) => (
                    <GridItem
                      key={report.id}
                      noOfColSpan={{
                        base: 1,
                        md: 1,
                        sm: 1,
                      }}
                    >
                      <Drawer direction='right'>
                        <DrawerTrigger className='h-full w-full'>
                          <ResourceCard resource={report} />
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerBody>
                            <ReportDetail report={report} />
                          </DrawerBody>
                        </DrawerContent>
                      </Drawer>
                    </GridItem>
                  ))}
          </Grid>
        )}
      </Container>
      <Spacer size='8xl' />
    </>
  );
}

export default App;
