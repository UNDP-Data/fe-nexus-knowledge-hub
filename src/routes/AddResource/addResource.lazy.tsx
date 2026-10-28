import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute } from '@tanstack/react-router';
import { Button } from '@undp/design-system-react/Button';
import { Container } from '@undp/design-system-react/Container';
import { Separator } from '@undp/design-system-react/Separator';
import { Spacer } from '@undp/design-system-react/Spacer';
import { useToast } from '@undp/design-system-react/ToasterHooks';
import { H2, P } from '@undp/design-system-react/Typography';
import {
  ReportFilesForm,
  type ReportFormValues,
  ReportMetadataForm,
  reportFormOptions,
  toReportPayload,
} from '@/components/ResourceFormSections';
import { API_BASE } from '@/constants';
import { useAppForm } from '@/lib/form';

type ReportPayload = ReturnType<typeof toReportPayload>;

export function AddResource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createReport = useMutation({
    mutationFn: async (payload: ReportPayload) => {
      const formData = new FormData();
      const metadata = {
        title: payload.title,
        abstract_md: payload.abstract,
        document_type: payload.documentType,
        locations: payload.regionOrCountry,
        hdp_tags: payload.hdpTags,
        thematic_tags: payload.thematicTags,
        dac_recommendations: payload.dacRecommendation,
        affiliations: payload.affiliations,
        authors: payload.authors,
        publication_year: payload.publicationYear,
        languages: payload.language,
        external_url: payload.link,
        rating: null,
      };
      formData.append('metadata', JSON.stringify(metadata));
      if (payload.bannerDocument) formData.append('banner', payload.bannerDocument);
      (payload.primaryDocuments || []).forEach((file: File) => {
        formData.append('documents', file);
      });
      (payload.secondaryDocuments || []).forEach((file: File) => {
        formData.append('attachments', file);
      });

      const response = await fetch(`${API_BASE}/publications`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Request failed (${response.status}): ${await response.text()}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-resources', 'admin'] });
      form.reset();
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

  const form = useAppForm({
    ...reportFormOptions,
    defaultValues: {
      ...reportFormOptions.defaultValues,
      publicationYear: new Date().getFullYear(),
    } as ReportFormValues,
    onSubmit: async ({ value }) => {
      await createReport.mutateAsync(toReportPayload(value)).catch(() => {});
    },
  });

  return (
    <div className='w-full'>
      <Container width='base' className='m-auto flex flex-col px-8! pt-8! pb-16!'>
        <div className='flex flex-col items-start justify-start gap-4'>
          <H2 marginBottom='none'>Add a new resource</H2>
          <P size='base' marginBottom='none' className='text-content-secondary'>
            Fields marked * are required.
          </P>
        </div>
        <Spacer size='3xl' />
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <ReportMetadataForm showStatus={false} form={form} />
          <Separator color='surface-md' />
          <Spacer size='3xl' />
          <ReportFilesForm form={form} />
          <Spacer size='3xl' />
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <div>
                <Button type='submit' color='primary' disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </Container>
    </div>
  );
}

export const Route = createLazyRoute('/add-resource')({
  component: AddResource,
});
