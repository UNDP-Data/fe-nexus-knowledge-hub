import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@undp/design-system-react/Badge';
import { Button } from '@undp/design-system-react/Button';
import { cn } from '@undp/design-system-react/cn';
import { FileUpload } from '@undp/design-system-react/FileUpload';
import { Grid, GridItem } from '@undp/design-system-react/Grid';
import { MarkdownRenderer } from '@undp/design-system-react/MarkdownRenderer';
import { Separator } from '@undp/design-system-react/Separator';
import { Spacer } from '@undp/design-system-react/Spacer';
import { toast } from '@undp/design-system-react/ToasterHooks';
import { H2, H4, P } from '@undp/design-system-react/Typography';
import { ArrowLeft, Edit, File, FileText, Image } from 'lucide-react';
import { useState } from 'react';
import { DAC_COLORS, HDP_TAG_COLORS, SESSION_STORAGE_NAME } from '@/constants';
import type { Publication } from '@/Types';
import { isAdmin } from '@/utils/isAdmin';
import { ReportMetadataForm } from './ReportEditForm';

export function ReportDetail({ report }: { report: Publication }) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [uploadingFileType, setUploadingFileType] = useState<'banner' | 'primary_document' | ''>(
    '',
  );
  const isUserAdmin = isAdmin();
  const splitDAC = (item: string) => {
    const [category, title] = item.replace(/^\d+\.\s*/, '').split(': ');
    return { category, title };
  };
  const updateDocuments = useMutation({
    mutationFn: async ({
      documents,
      documentType,
    }: {
      documents: File[];
      documentType: 'primary_document' | 'banner';
    }) => {
      const password = sessionStorage.getItem(SESSION_STORAGE_NAME) || '';
      const formData = new FormData();
      formData.append('role', documentType);
      formData.append('position', '1');
      formData.append('file', documents[0]);
      const response = await fetch(
        `https://hdpnexusapi-g2erbhe2hhb6bvfd.westeurope-01.azurewebsites.net/api/v1/admin/publications/${report.id}/assets`,
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'X-API-Key': password,
          },
          body: formData,
        },
      );
      if (!response.ok) {
        throw new Error(
          `Uploading "${documents[0].name}" failed (${response.status}): ${await response.text()}`,
        );
      }
      return response.status !== 204 ? await response.json() : null;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['get-all-reports'] });
      toast({
        title: 'Success',
        variant: 'success',
        description: 'Documents updated successfully.',
        duration: 3000,
      });
      setUploadingFileType('');
    },
    onError: (error) => {
      console.error('Failed to update publication:', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error.message,
        duration: 3000,
      });
    },
  });
  if (mode === 'edit') {
    return (
      <>
        <div className='py-6'>
          <Button variant='link' endIcon='none' padding='none' onClick={() => setMode('view')}>
            <ArrowLeft />
            Back to report detail
          </Button>
        </div>
        <EditReport report={report} setMode={setMode} />
      </>
    );
  }
  return (
    <>
      <div
        className='mt-6 flex h-100 w-full items-end rounded-lg bg-center bg-cover p-8'
        style={{
          backgroundImage: `url("${
            report.assets?.find((el) => el.role === 'banner')?.url ||
            'https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }")`,
        }}
      >
        {isUserAdmin && (
          <FileUpload
            accept='image/*'
            multiple={false}
            value={[]}
            disabled={updateDocuments.isPending && uploadingFileType === 'banner'}
            onFileChange={(files) => {
              if (files && files.length > 0) {
                setUploadingFileType('banner');
                updateDocuments.mutate({
                  documents: files,
                  documentType: 'banner',
                });
              }
            }}
          >
            <div className='flex w-fit cursor-pointer items-center justify-start gap-2 rounded-full bg-background px-4 py-2 hover:bg-surface-hover'>
              <Image />
              {updateDocuments.isPending && uploadingFileType === 'banner'
                ? 'Uploading...'
                : 'Upload banner image'}
            </div>
          </FileUpload>
        )}
      </div>
      <Spacer size='4xl' />
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap gap-3'>
          <Badge size='lg' rounded='full' color='secondary' className='bg-secondary/20 px-4 py-1'>
            <div className='flex items-center gap-2 text-blue-700'>
              <FileText size={16} />
              {report.document_type}
            </div>
          </Badge>
          <Badge size='lg' rounded='full' color='surface-sm' className='px-4 py-1'>
            {report.publication_year}
          </Badge>
          {isUserAdmin && (
            <Badge
              size='lg'
              rounded='full'
              color={
                report.status === 'approved'
                  ? 'green'
                  : report.status === 'rejected'
                    ? 'red'
                    : report.status === 'pending'
                      ? 'yellow'
                      : 'surface'
              }
              className='px-4 py-1'
            >
              <div className='flex items-center gap-1'>
                {report.status.replace(/\b\w/g, (char) => char.toUpperCase())}
              </div>
            </Badge>
          )}
        </div>
      </div>
      <Spacer size='xl' />
      <H2 marginBottom='none'>{report.title}</H2>
      {isUserAdmin && (
        <>
          <Spacer size='xl' />
          <Button
            variant='primary'
            color='surface-sm'
            endIcon='none'
            onClick={() => setMode('edit')}
          >
            <Edit />
            Edit report
          </Button>
        </>
      )}
      <Spacer size='3xl' />
      <Separator color='surface-md' />
      <Spacer size='3xl' />
      <Grid noOfCol={{ base: 1, md: 2, lg: 4 }}>
        {report.authors && (
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <P className='text-content-secondary' weight='medium' size='base' marginBottom='none'>
                Author
              </P>
              <P size='base' marginBottom='none'>
                {report.authors}
              </P>
            </div>
          </GridItem>
        )}
        {report.affiliations?.length > 0 && (
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <P className='text-content-secondary' weight='medium' size='base' marginBottom='none'>
                Affiliation
              </P>
              <P size='base' marginBottom='none'>
                {report.affiliations?.join(', ')}
              </P>
            </div>
          </GridItem>
        )}
        {report.locations?.length > 0 && (
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <P className='text-content-secondary' weight='medium' size='base' marginBottom='none'>
                Region / Country
              </P>
              <P size='base' marginBottom='none'>
                {report.locations.map((item) => item.name).join(', ')}
              </P>
            </div>
          </GridItem>
        )}
        {report.languages?.length > 0 && (
          <GridItem noOfColSpan={1}>
            <div className='flex flex-col gap-2'>
              <P className='text-content-secondary' weight='medium' size='base' marginBottom='none'>
                Language
              </P>
              <P size='base' marginBottom='none'>
                {report.languages.map((item) => item.name).join(', ')}
              </P>
            </div>
          </GridItem>
        )}
      </Grid>
      <Spacer size='5xl' />
      <Grid noOfCol={{ base: 1, md: 4 }} gap='48px'>
        <GridItem noOfColSpan={{ base: 1, md: 3 }}>
          <div className='flex flex-col gap-2'>
            <H4 weight='bold' marginBottom='none'>
              Abstract
            </H4>
            <MarkdownRenderer text={report.abstract_md || 'No abstract'} />
          </div>
          {report.external_url && (
            <>
              <Spacer size='2xl' />
              <a href={report.external_url} target='_blank' rel='noopener noreferrer'>
                <Button variant='link' endIcon='external-link' padding='none'>
                  Learn more about the report
                </Button>
              </a>
              <Spacer size='3xl' />
            </>
          )}
          <Separator color='surface-md' />
          <Spacer size='3xl' />
          <H4 weight='bold' marginBottom='none'>
            Classifications
          </H4>
          <Spacer size='2xl' />
          <div className='flex flex-col gap-2'>
            <P className='text-content-secondary' weight='medium' size='base' marginBottom='none'>
              HDP Nexus tags
            </P>
            <div className='flex flex-wrap gap-2'>
              {(report.hdp_tags || []).length > 0 ? (
                report.hdp_tags?.map((item) => (
                  <Badge
                    key={item}
                    color={
                      HDP_TAG_COLORS.find((d) => d.id === item)?.color as
                        | 'green'
                        | 'blue'
                        | 'orange'
                    }
                    className={cn(
                      'px-4 py-1 font-medium',
                      item === 'Peace'
                        ? 'bg-accent-green/15 text-accent-green'
                        : item === 'Humanitarian'
                          ? 'bg-blue-600/15 text-blue-600'
                          : 'bg-accent-orange/15 text-accent-orange',
                    )}
                  >
                    {item}
                  </Badge>
                ))
              ) : (
                <Badge key='No tags' color='surface-sm' className='px-4 py-1 font-medium'>
                  No tags
                </Badge>
              )}
            </div>
          </div>
          <Spacer size='2xl' />
          <div className='flex flex-col gap-2'>
            <P className='text-content-secondary' weight='medium' size='base' marginBottom='none'>
              Thematic tags
            </P>
            <div className='flex flex-wrap gap-2'>
              {(report.thematic_tags || []).length > 0 ? (
                report.thematic_tags?.map((item) => (
                  <Badge key={item} color='surface-sm' className='px-4 py-1 font-medium'>
                    {item}
                  </Badge>
                ))
              ) : (
                <Badge key='No tags' color='surface-sm' className='px-4 py-1 font-medium'>
                  No tags
                </Badge>
              )}
            </div>
          </div>
          <Spacer size='2xl' />
          <div className='flex flex-col gap-2'>
            <P className='text-content-secondary' weight='medium' size='base' marginBottom='none'>
              DAC Recommendation
            </P>
            {(report.dac_recommendations || []).length > 0 ? (
              <div className='flex flex-col rounded-sm border border-stroke'>
                {report.dac_recommendations?.map((item, i) => (
                  <div
                    key={item}
                    className={`p-6 ${i === report.dac_recommendations.length - 1 ? '' : 'border-stroke border-b'}`}
                  >
                    <Badge
                      color={
                        DAC_COLORS.find((d) => item.includes(d.id))?.color as
                          | 'teal'
                          | 'azure'
                          | 'lime'
                      }
                      size='lg'
                      rounded='full'
                      className={cn(
                        'px-4 py-1 font-medium',
                        splitDAC(item).category === 'Coordination'
                          ? 'bg-accent-lime/15 text-accent-lime'
                          : splitDAC(item).category === 'Programming'
                            ? 'bg-accent-teal/15 text-accent-teal'
                            : 'bg-accent-azure/15 text-accent-azure',
                      )}
                    >
                      {splitDAC(item).category}
                    </Badge>
                    <Spacer size='lg' />
                    <P weight='medium' size='xl' marginBottom='none'>
                      {splitDAC(item).title}
                    </P>
                  </div>
                ))}
              </div>
            ) : (
              <Badge
                key='No DAC Recommendation'
                color='surface-sm'
                className='px-4 py-1 font-medium'
              >
                No DAC Recommendation
              </Badge>
            )}
          </div>
        </GridItem>
        <GridItem noOfColSpan={1}>
          {report.assets.find((el) => el.role === 'primary_document' && el.position === 1) && (
            <div className='flex flex-col rounded-lg border border-stroke bg-surface p-6'>
              <P className='text-content-secondary' weight='medium' size='base' marginBottom='none'>
                Primary document
              </P>
              <Spacer size='lg' />
              <P marginBottom='none'>
                {
                  report.assets.find((el) => el.role === 'primary_document' && el.position === 1)
                    ?.original_filename
                }
              </P>
              <Spacer size='sm' />
              <P size='sm' className='text-content-secondary' marginBottom='none'>
                {report.assets
                  .find((el) => el.role === 'primary_document' && el.position === 1)
                  ?.content_type?.replace('application/', '')
                  ?.toUpperCase()}
              </P>
              <Spacer size='2xl' />
              <a
                href={
                  report.assets.find((el) => el.role === 'primary_document' && el.position === 1)
                    ?.url
                }
                className='w-full'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button endIcon='download' variant='primary' className='w-full'>
                  Download
                </Button>
              </a>
              {isUserAdmin && (
                <>
                  <Spacer size='xl' />
                  <FileUpload
                    accept='.pdf,.docx,image/*'
                    multiple={false}
                    value={[]}
                    disabled={updateDocuments.isPending && uploadingFileType === 'primary_document'}
                    onFileChange={(files) => {
                      if (files && files.length > 0) {
                        setUploadingFileType('primary_document');
                        updateDocuments.mutate({
                          documents: files,
                          documentType: 'primary_document',
                        });
                      }
                    }}
                  >
                    <div className='flex w-full cursor-pointer items-center justify-start gap-2 border-2 border-primary bg-background p-4 text-primary hover:bg-surface-hover'>
                      <File />
                      {updateDocuments.isPending && uploadingFileType === 'primary_document'
                        ? 'Uploading...'
                        : 'Upload the report here'}
                    </div>
                  </FileUpload>
                </>
              )}
            </div>
          )}
          {report.assets.filter(
            (el) =>
              !((el.role === 'primary_document' && el.position === 1) || el.role === 'banner'),
          ).length > 0 && (
            <div className='flex flex-col rounded-lg border border-stroke bg-surface p-6'>
              <P className='text-content-secondary' weight='medium' size='base' marginBottom='none'>
                Other documents
              </P>
              <Spacer size='lg' />
              <div className='flex flex-col gap-2'>
                {report.assets
                  .filter((el) => el.role !== 'banner')
                  .filter((el) => !(el.role === 'primary_document' && el.position === 1))
                  .map((asset) => (
                    <a
                      key={asset.id}
                      href={asset.url}
                      className='w-full bg-surface'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <P marginBottom='none'>{asset.original_filename}</P>
                    </a>
                  ))}
              </div>
            </div>
          )}
        </GridItem>
      </Grid>
      <Spacer size='2xl' />
    </>
  );
}

export function EditReport({
  report,
  setMode,
}: {
  report: Publication;
  setMode: (mode: 'view' | 'edit') => void;
}) {
  const isUserAdmin = isAdmin();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(report.title);
  const [abstract, setAbstract] = useState(report.abstract_md || '');
  const [publicationYear, setPublicationYear] = useState(report.publication_year);
  const [hdpTags, setHdpTags] = useState(report.hdp_tags || []);
  const [dacRecommendation, setDacRecommendation] = useState(report.dac_recommendations || []);
  const [regionOrCountry, setRegionOrCountry] = useState(
    report.locations.map((el) => el.m49_code) || [],
  );
  const [thematicTags, setThematicTags] = useState(report.thematic_tags || []);
  const [language, setLanguage] = useState(report.languages || []);
  const [authors, setAuthors] = useState(report.authors || '');
  const [link, setLink] = useState(report.external_url || '');
  const [documentType, setDocumentType] = useState(report.document_type || '');
  const [status, setStatus] = useState(report.status);
  const [affiliations, setAffiliations] = useState(report.affiliations || []);
  const updateReport = useMutation({
    mutationFn: async () => {
      const password = sessionStorage.getItem(SESSION_STORAGE_NAME) || '';
      const metadata = {
        title: title,
        abstract_md: abstract,
        document_type: documentType,
        locations: regionOrCountry,
        hdp_tags: hdpTags,
        thematic_tags: thematicTags,
        dac_recommendations: dacRecommendation,
        affiliations: affiliations,
        authors: authors,
        publication_year: publicationYear,
        languages: language,
        external_url: link,
        status: status,
        rating: null,
      };
      const response = await fetch(
        `https://hdpnexusapi-g2erbhe2hhb6bvfd.westeurope-01.azurewebsites.net/api/v1/admin/publications/${report.id}`,
        {
          method: 'PATCH',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            'X-API-Key': password,
          },
          body: JSON.stringify(metadata),
        },
      );
      if (!response.ok) {
        throw new Error(`Request failed (${response.status}): ${await response.text()}`);
      }
      return response.status !== 204 ? await response.json() : null;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['get-all-reports'] });
      toast({
        title: 'Success',
        variant: 'success',
        description: 'Report updated successfully.',
        duration: 3000,
      });
      setMode('view');
    },
    onError: (error) => {
      console.error('Failed to update publication:', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Failed to update report. Try again.',
        duration: 3000,
      });
    },
  });
  if (!isUserAdmin) {
    return <div>You are not authorized to edit this report.</div>;
  }
  return (
    <>
      <ReportMetadataForm
        title={title}
        setTitle={setTitle}
        hdpTags={hdpTags}
        setHdpTags={setHdpTags}
        abstract={abstract}
        setAbstract={setAbstract}
        link={link}
        setLink={setLink}
        documentType={documentType}
        setDocumentType={setDocumentType}
        publicationYear={publicationYear}
        setPublicationYear={setPublicationYear}
        language={language}
        setLanguage={setLanguage}
        dacRecommendation={dacRecommendation}
        setDacRecommendation={setDacRecommendation}
        affiliations={affiliations}
        setAffiliations={setAffiliations}
        authors={authors}
        setAuthors={setAuthors}
        status={status}
        setStatus={setStatus}
        regionOrCountry={regionOrCountry}
        setRegionOrCountry={setRegionOrCountry}
        thematicTags={thematicTags}
        setThematicTags={setThematicTags}
        cardBg='surface'
      />
      <Button
        color='primary'
        onClick={() => updateReport.mutate()}
        disabled={
          updateReport.isPending ||
          !title ||
          !documentType ||
          !authors ||
          !publicationYear ||
          language.length === 0
        }
      >
        {updateReport.isPending ? 'Saving...' : 'Submit'}
      </Button>
      <Spacer size='3xl' />
    </>
  );
}
