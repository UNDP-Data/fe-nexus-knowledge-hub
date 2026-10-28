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
import { A, H1, H3, H4, P } from '@undp/design-system-react/Typography';
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
          <H4>The go-to library for people working across humanitarian, development and peace.</H4>
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
            <H3>Our purpose</H3>
          </BannerBodySidebar>
          <BannerBodyContent>
            <P>
              The Nexus Knowledge Hub brings together over 500 resources — reports, evaluations,
              guidance, case studies, policy papers and peer-reviewed research — organised against
              the OECD DAC Recommendation on the Humanitarian-Development-Peace (HDP) Nexus. Built
              for practitioners, policymakers and researchers working in fragile and crisis-affected
              contexts, it is designed by the{' '}
              <A href='https://www.undp.org/crisis/academy/nexus' target='_blank'>
                Nexus Academy
              </A>{' '}
              as a digital public good: openly accessible, continuously curated, and free to use.
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
              <H3 marginBottom='none'>Recent resources</H3>
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
