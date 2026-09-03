import { useQuery } from '@tanstack/react-query';
import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';
import {
  Banner,
  BannerBody,
  BannerBodyContent,
  BannerBodySidebar,
} from '@undp/design-system-react/Banner';
import { Container } from '@undp/design-system-react/Container';
import { Grid, GridItem } from '@undp/design-system-react/Grid';
import { PageHeader, PageHeaderContent } from '@undp/design-system-react/PageHeader';
import { Spacer } from '@undp/design-system-react/Spacer';
import { Spinner } from '@undp/design-system-react/Spinner';
import { H1, H3, H4, P } from '@undp/design-system-react/Typography';
import type { DocumentDataType } from './Types';

function useRecentReportData() {
  return useQuery({
    queryKey: ['recent-reports'],
    queryFn: () => fetchAndParseCSV('/data/data.csv') as Promise<DocumentDataType[]>,
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
              <H3>Recent Reports</H3>
            </GridItem>
            {data?.slice(0, 5).map((report) => (
              <GridItem
                key={report.Title}
                noOfColSpan={{
                  base: 1,
                  md: 1,
                  sm: 1,
                }}
              >
                <div className='h-full bg-surface p-8'>
                  <H4 weight='bold'>{report.Title}</H4>
                  <P className='line-clamp-3'>{report.Abstract}</P>
                </div>
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
