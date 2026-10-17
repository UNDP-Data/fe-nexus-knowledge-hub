import { useQuery } from '@tanstack/react-query';
import { CheckboxGroup, CheckboxGroupItem } from '@undp/design-system-react/CheckboxGroup';
import { cn } from '@undp/design-system-react/cn';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { FileUpload } from '@undp/design-system-react/FileUpload';
import { Grid, GridItem } from '@undp/design-system-react/Grid';
import { Input } from '@undp/design-system-react/Input';
import { Label } from '@undp/design-system-react/Label';
import { Separator } from '@undp/design-system-react/Separator';
import { Spacer } from '@undp/design-system-react/Spacer';
import { Spinner } from '@undp/design-system-react/Spinner';
import { Textarea } from '@undp/design-system-react/Textarea';
import { H5 } from '@undp/design-system-react/Typography';
import { File, Image } from 'lucide-react';
import type { Locations, StatusType, Taxonomies } from '@/Types';

interface ReportMetadataFormProps {
  title: string;
  setTitle: (title: string) => void;
  hdpTags: string[];
  setHdpTags: (hdpTags: string[]) => void;
  abstract: string;
  setAbstract: (abstract: string) => void;
  link: string;
  setLink: (link: string) => void;
  documentType: string;
  setDocumentType: (documentType: string) => void;
  publicationYear: number;
  setPublicationYear: (publicationYear: number) => void;
  language: { code: string; name: string }[];
  setLanguage: (language: { code: string; name: string }[]) => void;
  dacRecommendation: string[];
  setDacRecommendation: (dacRecommendation: string[]) => void;
  affiliations: string[];
  setAffiliations: (affiliations: string[]) => void;
  authors: string;
  setAuthors: (authors: string) => void;
  status?: StatusType;
  setStatus?: (status: StatusType) => void;
  regionOrCountry: string[];
  setRegionOrCountry: (regionOrCountry: string[]) => void;
  thematicTags: string[];
  setThematicTags: (thematicTags: string[]) => void;
  cardBg?: string;
}

function useTaxonomies() {
  return useQuery({
    queryKey: ['get-taxonomies'],
    queryFn: async () => {
      const response = await fetch(
        'https://hdpnexusapi-g2erbhe2hhb6bvfd.westeurope-01.azurewebsites.net/api/v1/references/taxonomies',
      );
      const data = (await response.json()) as Taxonomies;
      return data;
    },
  });
}

function useLocations() {
  return useQuery({
    queryKey: ['get-locations'],
    queryFn: async () => {
      const response = await fetch(
        'https://hdpnexusapi-g2erbhe2hhb6bvfd.westeurope-01.azurewebsites.net/api/v1/references/locations?limit=300',
      );
      const data = (await response.json()) as Locations[];
      return data;
    },
  });
}

export function ReportMetadataForm({
  title,
  setTitle,
  hdpTags,
  setHdpTags,
  abstract,
  setAbstract,
  link,
  setLink,
  documentType,
  setDocumentType,
  publicationYear,
  setPublicationYear,
  language,
  setLanguage,
  dacRecommendation,
  setDacRecommendation,
  affiliations,
  setAffiliations,
  authors,
  setAuthors,
  status,
  setStatus,
  regionOrCountry,
  setRegionOrCountry,
  thematicTags,
  setThematicTags,
}: ReportMetadataFormProps) {
  const {
    data: taxonomies,
    isLoading: taxonomiesLoading,
    isError: taxonomiesError,
  } = useTaxonomies();

  const { data: locations, isLoading: locationsLoading, isError: locationsError } = useLocations();

  if (taxonomiesError) return <>Error</>;

  if (taxonomiesLoading || !taxonomies) return <Spinner size='lg' className='mx-auto my-20' />;

  return (
    <>
      <div className={cn('flex flex-col gap-6 rounded-md bg-background p-0')}>
        <H5 weight='bold' marginBottom='none'>
          About the report
        </H5>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='title'>Title*</Label>
          <Input
            inputSize='base'
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter the title of the report'
            rounded='base'
            variant='light'
            value={title}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='abstract'>Abstract*</Label>
          <Textarea
            onChange={(e) => setAbstract(e.target.value)}
            placeholder='Enter the abstract of the report'
            rounded='base'
            variant='light'
            value={abstract}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='link'>Link</Label>
          <Input
            inputSize='base'
            onChange={(e) => setLink(e.target.value)}
            placeholder='Enter the link of the report'
            rounded='base'
            variant='light'
            value={link}
          />
        </div>
        <Grid noOfCol={{ base: 1, md: 3 }} gap='24px'>
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='documentType'>Document Type*</Label>
              <DropdownSelect
                color='primary'
                variant='light'
                // biome-ignore lint/suspicious/noExplicitAny: need to fix in the library
                onChange={(d: any) => {
                  setDocumentType(d.value);
                }}
                options={taxonomies.document_types.map((item) => ({
                  label: item,
                  value: item,
                }))}
                value={{ label: documentType, value: documentType }}
                showCheck
                size='sm'
              />
            </div>
          </GridItem>
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='publicationYear'>Publication Year*</Label>
              <Input
                type='number'
                inputSize='base'
                onChange={(e) => setPublicationYear(Number(e.target.value))}
                placeholder='Enter the publication year of the report'
                rounded='base'
                variant='light'
                value={publicationYear}
              />
            </div>
          </GridItem>
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='language'>Language*</Label>
              <DropdownSelect
                color='primary'
                variant='light'
                onChange={(d) => {
                  setLanguage(d.map((item) => ({ code: item.value, name: item.label })));
                }}
                options={taxonomies.languages.map((item) => ({
                  label: item.name,
                  value: item.code,
                }))}
                value={language.map((item) => ({ label: item.name, value: item.code }))}
                showCheck
                isMulti
                size='sm'
              />
            </div>
          </GridItem>
          {status && setStatus && (
            <GridItem noOfColSpan={1}>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='status'>Status</Label>
                <DropdownSelect
                  color='primary'
                  variant='light'
                  // biome-ignore lint/suspicious/noExplicitAny: need to fix in the library
                  onChange={(d: any) => {
                    setStatus(d.value as StatusType);
                  }}
                  options={['pending', 'approved', 'rejected', 'archived'].map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  showCheck
                  size='sm'
                  value={{ label: status, value: status }}
                />
              </div>
            </GridItem>
          )}
        </Grid>
      </div>
      <Spacer size='3xl' />
      <Separator color='surface-md' />
      <Spacer size='3xl' />
      <div className={cn('flex flex-col gap-6 rounded-md bg-background p-0')}>
        <Grid noOfCol={{ base: 1, lg: 2 }} gap='24px'>
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='authors'>Authors*</Label>
              <Input
                inputSize='base'
                onChange={(e) => setAuthors(e.target.value)}
                placeholder='Enter the authors of the report'
                rounded='base'
                variant='light'
                value={authors}
              />
            </div>
          </GridItem>
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='affiliations'>Affiliations</Label>
              <Input
                inputSize='base'
                onChange={(e) =>
                  setAffiliations(e.target.value.split(',').map((item) => item.trim()))
                }
                placeholder='Enter the affiliations of the report'
                rounded='base'
                variant='light'
                value={affiliations.join(', ')}
              />
            </div>
          </GridItem>
        </Grid>
      </div>
      <Spacer size='3xl' />
      <Separator color='surface-md' />
      <Spacer size='3xl' />
      <div className={cn('flex flex-col gap-6 rounded-md bg-background p-0')}>
        {' '}
        <H5 weight='bold' marginBottom='none'>
          Classifications
        </H5>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='hdpTags'>HDP Tags</Label>
          <CheckboxGroup
            color='primary'
            onValueChange={(d) => {
              setHdpTags(d);
            }}
            value={hdpTags}
            rounded='base'
          >
            {taxonomies.hdp_tags.map((item) => (
              <CheckboxGroupItem key={item} label={item} value={item} />
            ))}
          </CheckboxGroup>
        </div>
        <Grid noOfCol={{ base: 1, lg: 2 }} gap='24px'>
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='countriesOrRegions'>Countries or regions</Label>
              {locationsError ? (
                <>Error loading locations</>
              ) : locationsLoading || !locations ? (
                <Spinner size='sm' className='mx-auto my-20' />
              ) : (
                <DropdownSelect
                  color='primary'
                  variant='light'
                  onChange={(d) => {
                    setRegionOrCountry(d.map((el) => el.value));
                  }}
                  options={locations.map((item) => ({
                    label: item.name,
                    value: item.m49_code,
                  }))}
                  value={regionOrCountry.map((item) => ({
                    label: locations.find((el) => el?.m49_code === item)?.name || '',
                    value: item,
                  }))}
                  showCheck
                  isMulti
                  isClearable
                  isSearchable
                  size='sm'
                />
              )}
            </div>
          </GridItem>
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='thematicTags'>Thematic tags</Label>
              <DropdownSelect
                color='primary'
                variant='light'
                onChange={(d) => {
                  setThematicTags(d.map((item) => item.value));
                }}
                options={taxonomies.thematic_tags.map((item) => ({
                  label: item,
                  value: item,
                }))}
                value={thematicTags.map((item) => ({ label: item, value: item }))}
                showCheck
                isMulti
                isClearable
                isSearchable
                size='sm'
              />
            </div>
          </GridItem>
        </Grid>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='dacRecommendations'>DAC recommendations</Label>
          <DropdownSelect
            color='primary'
            variant='light'
            onChange={(d) => {
              setDacRecommendation(d.map((item) => item.value));
            }}
            options={taxonomies.dac_recommendations.map((item) => ({
              label: item,
              value: item,
            }))}
            value={dacRecommendation.map((item) => ({ label: item, value: item }))}
            showCheck
            isMulti
            isClearable
            isSearchable
            size='sm'
          />
        </div>
      </div>
      <Spacer size='3xl' />
    </>
  );
}

interface ReportFilesFormProps {
  bannerDocument?: File;
  setBannerDocument: (bannerDocument: File) => void;
  primaryDocuments?: File[];
  setPrimaryDocuments: (primaryDocuments: File[]) => void;
  secondaryDocuments?: File[];
  setSecondaryDocuments: (secondaryDocuments: File[]) => void;
  cardBg?: string;
}

export function ReportFilesForm({
  bannerDocument,
  primaryDocuments,
  secondaryDocuments,
  setBannerDocument,
  setPrimaryDocuments,
  setSecondaryDocuments,
}: ReportFilesFormProps) {
  return (
    <>
      <div className={cn('flex flex-col gap-6 rounded-md bg-background p-0')}>
        <H5 weight='bold' marginBottom='none'>
          Files
        </H5>
        <Grid noOfCol={{ base: 1, lg: 2 }} gap='24px'>
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='primaryDocument'>Primary document</Label>
              <FileUpload
                accept='.pdf,.docx,image/*'
                multiple={false}
                onFileChange={(files) => {
                  setPrimaryDocuments(files);
                }}
                value={primaryDocuments}
              >
                <div className='flex w-full cursor-pointer items-center justify-start gap-2 bg-surface p-6 hover:bg-surface-hover'>
                  <File />
                  Upload the report here
                </div>
              </FileUpload>
            </div>
          </GridItem>
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='banner'>Banner</Label>
              <FileUpload
                accept='image/*'
                multiple={false}
                onFileChange={(files) => {
                  setBannerDocument(files?.[0]);
                }}
                value={bannerDocument ? [bannerDocument] : []}
              >
                <div className='flex w-full cursor-pointer items-center justify-start gap-2 bg-surface p-6 hover:bg-surface-hover'>
                  <Image />
                  Upload the banner here
                </div>
              </FileUpload>
            </div>
          </GridItem>
        </Grid>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='attachments'>Attachments (max. 10)</Label>
          <FileUpload
            accept='.pdf,.docx,image/*,.xlsx,.xls,.csv'
            multiple
            onFileChange={(files) => {
              setSecondaryDocuments(files);
            }}
            value={secondaryDocuments}
          />
        </div>
      </div>
      <Spacer size='3xl' />
    </>
  );
}
