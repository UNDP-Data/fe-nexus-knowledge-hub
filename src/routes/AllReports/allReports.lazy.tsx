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
import { Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@undp/design-system-react/Drawer';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Grid, GridItem } from '@undp/design-system-react/Grid';
import { PageHeader, PageHeaderContent } from '@undp/design-system-react/PageHeader';
import { Search } from '@undp/design-system-react/Search';
import { Spacer } from '@undp/design-system-react/Spacer';
import { Spinner } from '@undp/design-system-react/Spinner';
import { H1, H2, H4, P } from '@undp/design-system-react/Typography';
import { useMemo, useState } from 'react';
import { ReportDetail } from '@/components/ReportDetail';
import { IMG_URL } from '@/constants';
import type { DocumentDataType } from '@/Types';

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
          Affiliations: item['Affiliations']?.split(',') || [],
          id: `doc-${i + 1}`,
        };
      });
      return formattedData;
    },
  });
}
export function AllReportsPage() {
  const { data, isLoading, isError } = useRecentReportData();

  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [searchString, setSearchString] = useState('');
  const [regionAndCountries, setRegionAndCountries] = useState<string[]>([]);
  const [hdpTags, setHdpTags] = useState<string[]>([]);
  const [dacRecommendation, setDacRecommendation] = useState<string[]>([]);
  const [publicationYear, setPublicationYear] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [affiliations, setAffiliations] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return data?.filter((report) => {
      const documentTypeMatch =
        documentTypes.length === 0 || documentTypes.includes(report['Document Type']);
      const regionMatch =
        regionAndCountries.length === 0 ||
        regionAndCountries.some((r) => report['Region / Country'].includes(r));
      const hdpTagMatch =
        hdpTags.length === 0 || hdpTags.some((t) => report['HDP Tags'].includes(t));
      const dacRecommendationMatch =
        dacRecommendation.length === 0 ||
        dacRecommendation.some((d) => report['DAC Recommendation'].includes(d));
      const publicationYearMatch =
        publicationYear.length === 0 || publicationYear.includes(`${report['Publication Year']}`);
      const languageMatch =
        language.length === 0 || language.some((t) => report['Language'].includes(t));
      const affiliationMatch =
        affiliations.length === 0 || affiliations.some((t) => report['Affiliations'].includes(t));
      const searchStringMatch =
        searchString.length === 0 ||
        report['Title']?.toLowerCase().includes(searchString.toLowerCase()) ||
        report['Abstract']?.toLowerCase().includes(searchString.toLowerCase());
      return (
        documentTypeMatch &&
        regionMatch &&
        hdpTagMatch &&
        dacRecommendationMatch &&
        publicationYearMatch &&
        languageMatch &&
        affiliationMatch &&
        searchStringMatch
      );
    });
  }, [
    data,
    documentTypes,
    regionAndCountries,
    hdpTags,
    dacRecommendation,
    publicationYear,
    language,
    affiliations,
    searchString,
  ]);

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
      <Container width='full' className='m-auto px-8'>
        <div className='flex items-center justify-between gap-8'>
          <H2>All Reports</H2>
          <Search
            buttonVariant='icon'
            inputSize='base'
            inputVariant='light'
            onSearch={(value) => {
              setSearchString(value || '');
            }}
            showSearchButton={false}
            rounded='base'
          />
        </div>
        <Spacer size='2xl' />
        {isError ? (
          <>Error</>
        ) : isLoading || !data ? (
          <Spinner size='lg' className='mx-auto my-20' />
        ) : (
          <>
            <div className='flex w-full flex-wrap items-center gap-4'>
              <div className='min-w-50'>
                <P size='sm' marginBottom='sm' className='text-content-tertiary'>
                  Filter by document type
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setDocumentTypes(d.map((item) => `${item.value}`));
                  }}
                  options={[...new Set(data?.map((report) => report['Document Type']))]
                    .filter((item) => item && item.trim() !== '')
                    .sort((a, b) => a.localeCompare(b))
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='sm' className='text-content-tertiary'>
                  Filter by region/country
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setRegionAndCountries(d.map((item) => `${item.value}`));
                  }}
                  options={[...new Set(data?.flatMap((report) => report['Region / Country']))]
                    .filter((item) => item && item.trim() !== '')
                    .sort((a, b) => a.localeCompare(b))
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='sm' className='text-content-tertiary'>
                  Filter by HDP tags
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setHdpTags(d.map((item) => `${item.value}`));
                  }}
                  options={[...new Set(data?.flatMap((report) => report['HDP Tags']))]
                    .filter((item) => item && item.trim() !== '')
                    .sort((a, b) => a.localeCompare(b))
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='sm' className='text-content-tertiary'>
                  Filter by DAC recommendation
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setDacRecommendation(d.map((item) => `${item.value}`));
                  }}
                  options={[...new Set(data?.flatMap((report) => report['DAC Recommendation']))]
                    .filter((item) => item && item.trim() !== '')
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='sm' className='text-content-tertiary'>
                  Filter by publication year
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setPublicationYear(d.map((item) => `${item.value}`));
                  }}
                  options={[...new Set(data?.map((report) => report['Publication Year']))]
                    .filter((item) => item)
                    .sort((a, b) => b - a)
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='sm' className='text-content-tertiary'>
                  Filter by language
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setLanguage(d.map((item) => `${item.value}`));
                  }}
                  options={[...new Set(data?.flatMap((report) => report['Language']))]
                    .filter((item) => item)
                    .sort((a, b) => a.localeCompare(b))
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='sm' className='text-content-tertiary'>
                  Filter by affiliations
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setAffiliations(d.map((item) => `${item.value}`));
                  }}
                  options={[...new Set(data?.flatMap((report) => report['Affiliations']))]
                    .filter((item) => item)
                    .sort((a, b) => a.localeCompare(b))
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isClearable
                />
              </div>
            </div>
            <Spacer size='2xl' />
            <Grid
              gap='32px'
              noOfCol={{
                base: 1,
                md: 3,
                lg: 4,
                sm: 2,
              }}
            >
              {filteredData?.map((report) => (
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
                      <Card
                        backgroundColor='background-soft'
                        size='full'
                        variant='with-image'
                        className='h-full'
                      >
                        <CardHeader>
                          <CardTag className='pb-4!'>{report['Document Type']}</CardTag>
                          <CardImage
                            src={
                              report.Banner
                                ? `${IMG_URL}/${report.Banner}`
                                : 'https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                            }
                          />
                          <CardTitle>
                            <P className='line-clamp-2' weight='bold' size='lg' marginBottom='none'>
                              {report.Title}
                            </P>
                          </CardTitle>
                          <CardDescription>
                            <P className='line-clamp-3' size='base' marginBottom='none'>
                              {report.Abstract || 'No abstract available'}
                            </P>
                            <Spacer size='2xl' />
                            <div className='flex flex-col gap-2'>
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
          </>
        )}
      </Container>
    </>
  );
}

export const Route = createLazyRoute('/query-demo')({
  component: AllReportsPage,
});
