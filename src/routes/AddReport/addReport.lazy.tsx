import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute } from '@tanstack/react-router';
import { Button } from '@undp/design-system-react/Button';
import { Container } from '@undp/design-system-react/Container';
import { Separator } from '@undp/design-system-react/Separator';
import { Spacer } from '@undp/design-system-react/Spacer';
import { useToast } from '@undp/design-system-react/ToasterHooks';
import { H2, P } from '@undp/design-system-react/Typography';
import { useState } from 'react';
import { ReportFilesForm, ReportMetadataForm } from '@/components/ReportEditForm';
export function AddReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [title, setTitle] = useState<string>('');
  const [abstract, setAbstract] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [regionOrCountry, setRegionOrCountry] = useState<string[]>([]);
  const [hdpTags, setHdpTags] = useState<string[]>([]);
  const [thematicTags, setThematicTags] = useState<string[]>([]);
  const [dacRecommendation, setDacRecommendation] = useState<string[]>([]);
  const [affiliations, setAffiliations] = useState<string[]>([]);
  const [publicationYear, setPublicationYear] = useState<number>(2026);
  const [authors, setAuthors] = useState<string>('');
  const [language, setLanguage] = useState<{ code: string; name: string }[]>([]);
  const [link, setLink] = useState<string>('');
  const [banner, setBanner] = useState<File | undefined>(undefined);
  const [documents, setDocuments] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const resetForm = () => {
    setTitle('');
    setAbstract('');
    setDocumentType('');
    setRegionOrCountry([]);
    setHdpTags([]);
    setThematicTags([]);
    setDacRecommendation([]);
    setAffiliations([]);
    setPublicationYear(2026);
    setAuthors('');
    setLanguage([]);
    setLink('');
    setBanner(undefined);
    setDocuments([]);
    setAttachments([]);
  };
  const createReport = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      const metadata = {
        title: title,
        abstract_md: abstract,
        document_type: documentType,
        locations: regionOrCountry,
        hdp_tags: hdpTags,
        thematic_tags: thematicTags,
        dac_recommendations: dacRecommendation,
        affiliations,
        authors,
        publication_year: publicationYear,
        languages: language,
        external_url: link,
        rating: null,
      };
      formData.append('metadata', JSON.stringify(metadata));
      if (banner) formData.append('banner', banner);
      documents.forEach((file) => {
        formData.append('documents', file);
      });
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
      const response = await fetch(
        'https://hdpnexusapi-g2erbhe2hhb6bvfd.westeurope-01.azurewebsites.net/api/v1/publications',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        },
      );
      if (!response.ok) {
        throw new Error(`Request failed (${response.status}): ${await response.text()}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-reports', 'admin'] });
      resetForm();
      toast({
        title: 'Success',
        variant: 'success',
        description: 'Report submitted successfully.',
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('Failed to create publication:', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Failed to submit report. Try again.',
        duration: 3000,
      });
    },
  });
  return (
    <div className='w-full'>
      <Container width='base' className='m-auto flex flex-col px-8! pt-16! pb-16!'>
        <div className='flex flex-col items-start justify-start gap-4'>
          <H2 marginBottom='none'>Add a New Report</H2>
          <P size='base' marginBottom='none' className='text-content-secondary'>
            Fields marked * are required.
          </P>
        </div>
        <Spacer size='3xl' />
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
          regionOrCountry={regionOrCountry}
          setRegionOrCountry={setRegionOrCountry}
          thematicTags={thematicTags}
          setThematicTags={setThematicTags}
        />
        <Separator color='surface-md' />
        <Spacer size='3xl' />
        <ReportFilesForm
          bannerDocument={banner}
          primaryDocuments={documents}
          secondaryDocuments={attachments}
          setBannerDocument={setBanner}
          setPrimaryDocuments={setDocuments}
          setSecondaryDocuments={setAttachments}
        />
        <Spacer size='3xl' />
        <div>
          <Button
            color='primary'
            onClick={() => createReport.mutate()}
            disabled={
              createReport.isPending ||
              !title ||
              !documentType ||
              !authors ||
              !publicationYear ||
              language.length === 0 ||
              !banner ||
              documents.length === 0
            }
          >
            {createReport.isPending ? 'Saving...' : 'Submit'}
          </Button>
        </div>
      </Container>
    </div>
  );
}

export const Route = createLazyRoute('/add-report')({
  component: AddReport,
});
