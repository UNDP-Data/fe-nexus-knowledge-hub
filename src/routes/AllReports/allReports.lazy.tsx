import { useQuery } from '@tanstack/react-query';
import { createLazyRoute } from '@tanstack/react-router';
import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';
import { Button } from '@undp/design-system-react/Button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTag,
  CardTitle,
} from '@undp/design-system-react/Card';
import { Container } from '@undp/design-system-react/Container';
import { Grid, GridItem } from '@undp/design-system-react/Grid';
import { PageHeader, PageHeaderContent } from '@undp/design-system-react/PageHeader';
import { Spacer } from '@undp/design-system-react/Spacer';
import { Spinner } from '@undp/design-system-react/Spinner';
import { H1, H2, H4, P } from '@undp/design-system-react/Typography';
import type { DocumentDataType } from '@/Types';

function useRecentReportData() {
  return useQuery({
    queryKey: ['recent-reports'],
    queryFn: () => fetchAndParseCSV('/data/data.csv') as Promise<DocumentDataType[]>,
  });
}

export function AllReportsPage() {
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
      <Spacer size='8xl' />
      <Container width='lg' className='m-auto'>
        <H2>All Reports</H2>
        <Spacer size='2xl' />
        {isLoading ? (
          <Spinner size='lg' className='mx-auto my-20' />
        ) : isError ? (
          <>Error</>
        ) : (
          <Grid
            gap='32px'
            noOfCol={{
              base: 1,
              md: 3,
              lg: 4,
              sm: 2,
            }}
          >
            {data?.map((report) => (
              <GridItem
                key={report.Title}
                noOfColSpan={{
                  base: 1,
                  md: 1,
                  sm: 1,
                }}
              >
                <Card
                  backgroundColor='background-soft'
                  size='full'
                  variant='with-image'
                  className='h-full'
                >
                  <CardHeader>
                    <CardTag className='pb-4!'>{report['Document Type']}</CardTag>
                    <CardImage src='https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                    <CardTitle>
                      <P className='line-clamp-3' weight='bold' size='lg' marginBottom='none'>
                        {report.Title}
                      </P>
                    </CardTitle>
                    <CardDescription>
                      <P className='line-clamp-3' size='base' marginBottom='none'>
                        {report.Abstract}
                      </P>
                      <Spacer size='2xl' />
                      <div className='flex flex-col gap-1'>
                        <P className='text-content-tertiary' marginBottom='none' size='sm'>
                          Publication year
                        </P>
                        <P marginBottom='none' size='sm'>
                          {report['Publication Year']}
                        </P>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button padding='none' variant='link'>
                      Read more
                    </Button>
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
          </Grid>
        )}
      </Container>
      <div className='mx-auto my-8 flex items-center justify-center gap-4'>
        <img
          src='/imgs/Vitejs-logo.svg'
          alt='vite logo'
          width='72px'
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
        <P marginBottom='none'>&</P>
        <img
          src='/imgs/Tailwind_CSS_Logo.svg'
          alt='tailwind logo'
          width='72px'
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
        <P marginBottom='none'>&</P>
        <img
          src='/imgs/Tanstack-logo.png'
          alt='tanstack logo'
          width='72px'
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
        <P marginBottom='none'>&</P>
        <img
          src='/imgs/Zustand-logo.svg'
          alt='Zustand logo'
          width='72px'
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
        <P marginBottom='none'>&</P>
        <img
          src='/imgs/undp-logo-blue.svg'
          alt='UNDP logo'
          width='72px'
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
      </div>
      <P marginBottom='xl' className='text-center'>
        Data loaded successfully. {data?.length} elements in the query.
      </P>
    </>
  );
}

export const Route = createLazyRoute('/query-demo')({
  component: AllReportsPage,
});
