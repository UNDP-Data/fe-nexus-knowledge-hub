import { useQuery } from '@tanstack/react-query';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';
import { Container } from '@undp/design-system-react/Container';
import { Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@undp/design-system-react/Drawer';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Grid, GridItem } from '@undp/design-system-react/Grid';
import { Search } from '@undp/design-system-react/Search';
import { Spacer } from '@undp/design-system-react/Spacer';
import { H2, P } from '@undp/design-system-react/Typography';
import { useMemo, useState } from 'react';
import { ResourceCard } from '@/components/ResourceCard';
import { ReportDetail } from '@/components/ResourceDetail';
import { CardGridSkeleton, FilterSkeleton } from '@/components/Skeleton';
import { API_BASE, SESSION_STORAGE_NAME, STATUSES } from '@/constants';
import type { PublicationsResponse, Taxonomies } from '@/Types';
import { isAdmin } from '@/utils/isAdmin';

function useAllReportData(key?: string | null) {
  return useQuery({
    queryKey: key ? ['get-all-resources', 'admin'] : ['get-all-resources'],
    queryFn: async () => {
      const response = key
        ? await fetch(`${API_BASE}/admin/publications/all`, {
            method: 'GET',
            headers: {
              Accept: '*/*',
              'X-API-Key': key,
            },
          })
        : await fetch(`${API_BASE}/publications/all`);
      const data = (await response.json()) as PublicationsResponse;
      return data.items;
    },
  });
}

function useTaxonomies() {
  return useQuery({
    queryKey: ['get-taxonomies'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/references/taxonomies`);
      const data = (await response.json()) as Taxonomies;
      return data;
    },
  });
}

const routeApi = getRouteApi('/all-resources');

export function AllResourcesPage() {
  const isUserAdmin = isAdmin();
  const key = sessionStorage.getItem(SESSION_STORAGE_NAME);
  const {
    data,
    isLoading: dataLoading,
    isError: dataError,
  } = useAllReportData(isUserAdmin ? key : undefined);
  const {
    data: taxonomies,
    isLoading: taxonomiesLoading,
    isError: taxonomiesError,
  } = useTaxonomies();

  const { reportId } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const setReportId = (id?: string) =>
    navigate({
      search: () => ({ reportId: id }),
      resetScroll: false,
    });
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>(['approved', 'pending']);
  const [searchString, setSearchString] = useState('');
  const [regionAndCountries, setRegionAndCountries] = useState<string[]>([]);
  const [hdpTags, setHdpTags] = useState<string[]>([]);
  const [dacRecommendation, setDacRecommendation] = useState<string[]>([]);
  const [publicationYear, setPublicationYear] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [affiliations, setAffiliations] = useState<string[]>([]);
  const [thematicTags, setThematicTags] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return data?.filter((report) => {
      const documentTypeMatch =
        documentTypes.length === 0 || documentTypes.includes(report.document_type);
      const regionMatch =
        regionAndCountries.length === 0 ||
        regionAndCountries.some((r) => report.locations.map((el) => el.name).includes(r));
      const hdpTagMatch = hdpTags.length === 0 || hdpTags.some((t) => report.hdp_tags.includes(t));
      const dacRecommendationMatch =
        dacRecommendation.length === 0 ||
        dacRecommendation.some((d) => report.dac_recommendations.includes(d));
      const publicationYearMatch =
        publicationYear.length === 0 || publicationYear.includes(`${report.publication_year}`);
      const languageMatch =
        language.length === 0 || language.some((t) => report.languages.find((l) => l.code === t));
      const affiliationMatch =
        affiliations.length === 0 || affiliations.some((t) => report.affiliations.includes(t));
      const thematicTagMatch =
        thematicTags.length === 0 || thematicTags.some((t) => report.thematic_tags.includes(t));
      const searchStringMatch =
        searchString.length === 0 ||
        report.title?.toLowerCase().includes(searchString.toLowerCase()) ||
        report.abstract_md?.toLowerCase().includes(searchString.toLowerCase());
      const statusFilterMatch =
        !isUserAdmin ||
        statusFilter.length === 0 ||
        statusFilter.includes(report.status) ||
        (statusFilter.includes('Pending') && report.status === 'pending') ||
        (statusFilter.includes('Approved') && report.status === 'approved');
      return (
        documentTypeMatch &&
        regionMatch &&
        hdpTagMatch &&
        dacRecommendationMatch &&
        publicationYearMatch &&
        languageMatch &&
        affiliationMatch &&
        thematicTagMatch &&
        searchStringMatch &&
        statusFilterMatch
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
    thematicTags,
    searchString,
    statusFilter,
    isUserAdmin,
  ]);

  return (
    <Container width='full' className='m-auto items-start px-8! pt-8! pb-16!'>
      <div className='flex items-center justify-between gap-8'>
        <H2>All Resources</H2>
        <Search
          inputSize='base'
          inputVariant='light'
          onSearch={(value) => {
            setSearchString(value || '');
          }}
          showSearchButton={false}
          rounded='base'
          disabled={!dataLoading && !data}
        />
      </div>
      <Spacer size='2xl' />
      {dataError || taxonomiesError ? (
        <>Error</>
      ) : (
        <>
          {taxonomiesLoading || !taxonomies ? (
            <FilterSkeleton noOfFIlter={isUserAdmin ? 9 : 8} />
          ) : (
            <div className='flex w-full flex-wrap items-center gap-4'>
              <div className='min-w-50'>
                <P size='sm' marginBottom='3xs' className='text-content-tertiary'>
                  Filter by document type
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setDocumentTypes(d.map((item) => `${item.value}`));
                  }}
                  options={taxonomies.document_types.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  showCheck
                  size='sm'
                  isDisabled={!dataLoading && !data}
                  isMulti
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='3xs' className='text-content-tertiary'>
                  Filter by region/country
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setRegionAndCountries(d.map((item) => `${item.value}`));
                  }}
                  options={[
                    ...new Set(data?.flatMap((report) => report.locations.map((el) => el.name))),
                  ]
                    .filter((item) => item && item.trim() !== '')
                    .sort((a, b) => a.localeCompare(b))
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isDisabled={!dataLoading && !data}
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='3xs' className='text-content-tertiary'>
                  Filter by HDP tags
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setHdpTags(d.map((item) => `${item.value}`));
                  }}
                  options={taxonomies.hdp_tags.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  showCheck
                  size='sm'
                  isMulti
                  isDisabled={!dataLoading && !data}
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='3xs' className='text-content-tertiary'>
                  Filter by tags
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setThematicTags(d.map((item) => `${item.value}`));
                  }}
                  options={taxonomies.thematic_tags.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  showCheck
                  size='sm'
                  isMulti
                  isDisabled={!dataLoading && !data}
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='3xs' className='text-content-tertiary'>
                  Filter by DAC recommendation
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setDacRecommendation(d.map((item) => `${item.value}`));
                  }}
                  options={taxonomies.dac_recommendations.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  showCheck
                  size='sm'
                  isMulti
                  isDisabled={!dataLoading && !data}
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='3xs' className='text-content-tertiary'>
                  Filter by publication year
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setPublicationYear(d.map((item) => `${item.value}`));
                  }}
                  options={[...new Set(data?.map((report) => report.publication_year))]
                    .filter((item) => item)
                    .sort((a, b) => b - a)
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isDisabled={!dataLoading && !data}
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='3xs' className='text-content-tertiary'>
                  Filter by language
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setLanguage(d.map((item) => `${item.value}`));
                  }}
                  options={taxonomies.languages.map((item) => ({
                    label: item.name,
                    value: item.code,
                  }))}
                  showCheck
                  size='sm'
                  isMulti
                  isDisabled={!dataLoading && !data}
                  isClearable
                />
              </div>
              <div className='min-w-50'>
                <P size='sm' marginBottom='3xs' className='text-content-tertiary'>
                  Filter by affiliations
                </P>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setAffiliations(d.map((item) => `${item.value}`));
                  }}
                  options={[...new Set(data?.flatMap((report) => report.affiliations))]
                    .filter((item) => item)
                    .sort((a, b) => a.localeCompare(b))
                    .map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  showCheck
                  size='sm'
                  isMulti
                  isDisabled={!dataLoading && !data}
                  isClearable
                />
              </div>
              {isUserAdmin && (
                <div className='min-w-50'>
                  <P size='sm' marginBottom='3xs' className='text-content-tertiary'>
                    Filter by status
                  </P>
                  <DropdownSelect
                    color='primary'
                    variant='light'
                    onChange={(d) => {
                      setStatusFilter(d.map((item) => `${item.value}`));
                    }}
                    defaultValue={[
                      {
                        value: 'pending',
                        label: 'Pending',
                      },
                      {
                        value: 'approved',
                        label: 'Approved',
                      },
                    ]}
                    options={STATUSES}
                    showCheck
                    size='sm'
                    isDisabled={!dataLoading && !data}
                    isMulti
                    isClearable
                  />
                </div>
              )}
            </div>
          )}
          <Spacer size='2xl' />
          {dataLoading || !data ? (
            <CardGridSkeleton />
          ) : (
            <Grid
              gap='32px'
              noOfCol={{
                base: 1,
                md: 3,
                xl: 4,
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
                  <Drawer
                    direction='right'
                    open={reportId === report.id}
                    onOpenChange={(open) => setReportId(open ? report.id : undefined)}
                  >
                    <DrawerTrigger className='h-full w-full'>
                      <ResourceCard resource={report} isUserAdmin={isUserAdmin} />
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
        </>
      )}
    </Container>
  );
}

export const Route = createLazyRoute('/all-resources')({
  component: AllResourcesPage,
});
