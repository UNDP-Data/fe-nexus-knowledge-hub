import { formOptions } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { Grid, GridItem } from '@undp/design-system-react/Grid';
import { Separator } from '@undp/design-system-react/Separator';
import { Spacer } from '@undp/design-system-react/Spacer';
import { H5 } from '@undp/design-system-react/Typography';
import { API_BASE } from '@/constants';
import { withForm } from '@/lib/form';
import type { Locations, StatusType, Taxonomies } from '@/Types';

export interface ReportFormValues {
  title: string;
  abstract: string;
  link: string;
  documentType: string;
  publicationYear?: number;
  language: { code: string; name: string }[];
  status: StatusType | '';
  authors: string;
  affiliations: string;
  hdpTags: string[];
  regionOrCountry: string[];
  thematicTags: string[];
  dacRecommendation: string[];
  primaryDocuments?: File[];
  bannerDocument?: File;
  secondaryDocuments?: File[];
}

export const reportFormOptions = formOptions({
  defaultValues: {
    title: '',
    abstract: '',
    link: '',
    documentType: '',
    publicationYear: undefined,
    language: [],
    status: '',
    authors: '',
    affiliations: '',
    hdpTags: [],
    regionOrCountry: [],
    thematicTags: [],
    dacRecommendation: [],
    primaryDocuments: [],
    bannerDocument: undefined,
    secondaryDocuments: [],
  } as ReportFormValues,
});

export function toReportPayload(values: ReportFormValues) {
  return {
    ...values,
    affiliations: values.affiliations
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

const required =
  (message: string) =>
  ({ value }: { value: unknown }) => {
    if (value === undefined || value === null) return message;
    if (typeof value === 'string' && value.trim() === '') return message;
    if (Array.isArray(value) && value.length === 0) return message;
    return undefined;
  };

const urlValidator = ({ value }: { value: string }) => {
  if (value === undefined || value === null) return 'URL is required';
  if (value.length > 2000) return 'Link must be 2000 characters or fewer';
  if (!/^https?:\/\/.+/.test(value)) return 'Link must start with http:// or https://';
  return undefined;
};

const yearValidator = ({ value }: { value: number | undefined }) => {
  if (value === undefined || Number.isNaN(value)) return 'Publication year is required';
  const max = new Date().getFullYear() + 1;
  if (!Number.isInteger(value) || value < 1900 || value > max)
    return `Enter a year between 1900 and ${max}`;
  return undefined;
};

export function useTaxonomies() {
  return useQuery({
    queryKey: ['get-taxonomies'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/references/taxonomies`);
      return (await response.json()) as Taxonomies;
    },
  });
}

export function useLocations() {
  return useQuery({
    queryKey: ['get-locations'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/references/locations?limit=300`);
      return (await response.json()) as Locations[];
    },
  });
}

const STATUS_OPTIONS: StatusType[] = ['pending', 'approved', 'rejected', 'archived'];

export const ReportMetadataForm = withForm({
  ...reportFormOptions,
  props: {
    showStatus: false as boolean,
  },
  render: function Render({ form, showStatus }) {
    const {
      data: taxonomies,
      isLoading: taxonomiesLoading,
      isError: taxonomiesError,
    } = useTaxonomies();
    const {
      data: locations,
      isLoading: locationsLoading,
      isError: locationsError,
    } = useLocations();

    if (taxonomiesError) return <>Error loading taxonomies</>;
    return (
      <>
        <div className='flex flex-col gap-6'>
          <H5 weight='bold' marginBottom='none'>
            About the resource
          </H5>

          <form.AppField name='title' validators={{ onChange: required('Title is required') }}>
            {(field) => (
              <field.TextField
                isRequired
                label='Title'
                placeholder='Enter the title of the resource'
              />
            )}
          </form.AppField>

          <form.AppField name='abstract'>
            {(field) => (
              <field.TextAreaField
                label='Abstract'
                placeholder='Enter the abstract of the resource'
              />
            )}
          </form.AppField>

          <form.AppField name='link' validators={{ onChange: urlValidator }}>
            {(field) => (
              <field.URLField
                label='Link'
                isRequired
                placeholder='Enter the link of the resource'
              />
            )}
          </form.AppField>

          <Grid noOfCol={{ base: 1, md: 3 }} gap='24px'>
            <GridItem noOfColSpan={1}>
              <form.AppField
                name='documentType'
                validators={{ onChange: required('Document type is required') }}
              >
                {(field) => (
                  <field.SingleSelectField
                    isRequired
                    isLoading={taxonomiesLoading || !taxonomies}
                    label='Document Type'
                    options={taxonomies?.document_types.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                )}
              </form.AppField>
            </GridItem>
            <GridItem noOfColSpan={1}>
              <form.AppField name='publicationYear' validators={{ onChange: yearValidator }}>
                {(field) => (
                  <field.NumberField
                    isRequired
                    label='Publication Year'
                    placeholder='Enter the publication year of the resource'
                  />
                )}
              </form.AppField>
            </GridItem>
            <GridItem noOfColSpan={1}>
              <form.AppField
                name='language'
                validators={{ onChange: required('Select at least one language') }}
              >
                {(field) => (
                  <field.LanguageSelectField
                    isRequired
                    isLoading={taxonomiesLoading || !taxonomies}
                    label='Language'
                    options={taxonomies?.languages.map((item) => ({
                      label: item.name,
                      value: item.code,
                    }))}
                  />
                )}
              </form.AppField>
            </GridItem>
            {showStatus && (
              <GridItem noOfColSpan={1}>
                <form.AppField name='status'>
                  {(field) => (
                    <field.SingleSelectField
                      label='Status'
                      options={STATUS_OPTIONS.map((item) => ({ label: item, value: item }))}
                    />
                  )}
                </form.AppField>
              </GridItem>
            )}
          </Grid>
        </div>

        <Spacer size='3xl' />
        <Separator color='surface-md' />
        <Spacer size='3xl' />

        <div className='flex flex-col gap-6'>
          <H5 weight='bold' marginBottom='none'>
            Author and Affiliation
          </H5>
          <Grid noOfCol={{ base: 1, lg: 2 }} gap='24px'>
            <GridItem noOfColSpan={1}>
              <form.AppField
                name='authors'
                validators={{ onChange: required('Authors are required') }}
              >
                {(field) => (
                  <field.TextField
                    isRequired
                    label='Authors'
                    placeholder='Enter the authors of the resource'
                  />
                )}
              </form.AppField>
            </GridItem>
            <GridItem noOfColSpan={1}>
              <form.AppField
                name='affiliations'
                validators={{ onChange: required('Affiliations are required') }}
              >
                {(field) => (
                  <field.TextField
                    isRequired
                    label='Affiliations'
                    placeholder='Comma-separated, e.g. UNDP, UNICEF'
                  />
                )}
              </form.AppField>
            </GridItem>
          </Grid>
        </div>

        <Spacer size='3xl' />
        <Separator color='surface-md' />
        <Spacer size='3xl' />

        <div className='flex flex-col gap-6'>
          <H5 weight='bold' marginBottom='none'>
            Details
          </H5>

          <form.AppField name='hdpTags'>
            {(field) => (
              <field.CheckboxGroupField
                label='HDP Nexus pillars'
                isLoading={taxonomiesLoading || !taxonomies}
                options={taxonomies?.hdp_tags.map((item) => ({ label: item, value: item }))}
              />
            )}
          </form.AppField>

          <Grid noOfCol={{ base: 1, lg: 2 }} gap='24px'>
            <GridItem noOfColSpan={1}>
              {locationsError ? (
                <>Error loading locations</>
              ) : (
                <form.AppField name='regionOrCountry'>
                  {(field) => (
                    <field.MultiSelectField
                      label='Countries or regions'
                      isLoading={locationsLoading || !locations}
                      options={locations?.map((item) => ({
                        label: item.name,
                        value: item.m49_code,
                      }))}
                    />
                  )}
                </form.AppField>
              )}
            </GridItem>
            <GridItem noOfColSpan={1}>
              <form.AppField name='thematicTags'>
                {(field) => (
                  <field.MultiSelectField
                    label='Thematic areas'
                    isLoading={taxonomiesLoading || !taxonomies}
                    options={taxonomies?.thematic_tags.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                )}
              </form.AppField>
            </GridItem>
          </Grid>

          <form.AppField name='dacRecommendation'>
            {(field) => (
              <field.MultiSelectField
                label='DAC recommendations'
                isLoading={taxonomiesLoading || !taxonomies}
                options={taxonomies?.dac_recommendations.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            )}
          </form.AppField>
        </div>

        <Spacer size='3xl' />
      </>
    );
  },
});

export const ReportFilesForm = withForm({
  ...reportFormOptions,
  render: function Render({ form }) {
    return (
      <>
        <div className='flex flex-col gap-6'>
          <H5 weight='bold' marginBottom='none'>
            Files
          </H5>
          <Grid noOfCol={{ base: 1, lg: 2 }} gap='24px'>
            <GridItem noOfColSpan={1}>
              <form.AppField name='primaryDocuments'>
                {(field) => (
                  <field.PrimaryDocumentFileUpload
                    label='Primary document'
                    acceptFiles='.pdf,.docx,image/*'
                    text='Upload the resource here'
                  />
                )}
              </form.AppField>
            </GridItem>
            <GridItem noOfColSpan={1}>
              <form.AppField name='bannerDocument'>
                {(field) => (
                  <field.SingleFileUpload
                    label='Banner'
                    acceptFiles='image/*'
                    text='Upload the banner here'
                  />
                )}
              </form.AppField>
            </GridItem>
          </Grid>

          <form.AppField
            name='secondaryDocuments'
            validators={{
              onChange: ({ value }) =>
                (value || []).length > 10 ? 'You can upload at most 10 attachments' : undefined,
            }}
          >
            {(field) => (
              <field.MultipleFileUpload
                label='Attachments (max. 10)'
                acceptFiles='.pdf,.docx,image/*,.xlsx,.xls,.csv'
                text='Upload the attachments here'
              />
            )}
          </form.AppField>
        </div>
        <Spacer size='3xl' />
      </>
    );
  },
});
