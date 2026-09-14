import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';
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
import { ReportDetail } from './components/ReportDetail';
import type { DocumentDataType } from './Types';

function useRecentReportData() {
  return useQuery({
    queryKey: ['all-reports'],
    queryFn: async () => {
      const data = (await fetchAndParseCSV('/data/data.csv')) as DocumentDataType[];
      if (!data || data.length === 0) return [];
      const formattedData = data.map((item, i) => {
        return {
          ...item,
          'Region / Country': item['Region / Country']?.split(',') || [],
          'DAC Recommendation': item['DAC Recommendation']?.split(',') || [],
          'HDP Tags': item['HDP Tags']?.split(',') || [],
          Language: item['Language']?.split(',') || [],
          id: `doc-${i + 1}`,
        };
      });
      return formattedData;
    },
  });
}

function App() {
  const { data, isLoading, isError } = useRecentReportData();

  if (isLoading) return <Spinner size='lg' className='mx-auto my-20' />;

  if (isError) return <>Error</>;
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
            gap='16px'
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
              <H3 marginBottom='none'>Recent Reports</H3>
              <Spacer size='2xl' />
              <Button variant='link' padding='none'>
                <Link to='/all-reports'>View All Reports</Link>
              </Button>
            </GridItem>
            {data?.slice(0, 5).map((report) => (
              <GridItem
                key={report.id}
                noOfColSpan={{
                  base: 1,
                  md: 1,
                  sm: 1,
                }}
              >
                <Drawer direction='right'>
                  <DrawerTrigger className='h-full'>
                    <div className='h-full cursor-pointer bg-surface p-8 hover:bg-surface-hover'>
                      <P size='lg' weight='bold'>
                        {report.Title}
                      </P>
                      <P size='base' className='line-clamp-3'>
                        {report.Abstract}
                      </P>
                    </div>
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
