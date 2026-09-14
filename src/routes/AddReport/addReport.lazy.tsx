import { createLazyRoute } from '@tanstack/react-router';
import { Container } from '@undp/design-system-react/Container';
import { Input } from '@undp/design-system-react/Input';
import { Label } from '@undp/design-system-react/Label';
import { Spacer } from '@undp/design-system-react/Spacer';
import { H2 } from '@undp/design-system-react/Typography';
import { useState } from 'react';

export function AllReportsPage() {
  const [title, setTitle] = useState<string | undefined>();
  const [abstract, setAbstract] = useState<string | undefined>();
  const [documentType, setDocumentType] = useState<string | undefined>();
  const [regionOrCountry, setRegionOrCountry] = useState<string | undefined>();
  const [hdpTags, setHdpTags] = useState<string | undefined>();
  const [thematicTags, setThematicTags] = useState<string | undefined>();
  const [dacRecommendation, setDacRecommendation] = useState<string | undefined>();
  const [affiliations, setAffiliations] = useState<string | undefined>();
  const [authors, setAuthors] = useState<string | undefined>();
  const [language, setLanguage] = useState<string | undefined>();
  const [link, setLink] = useState<string | undefined>();
  const [banner, setBanner] = useState<string | undefined>();
  const [pdf, setPdf] = useState<string | undefined>();
  return (
    <Container width='base' className='m-auto px-8'>
      <div className='flex items-center justify-between gap-8'>
        <H2>Add a New Report</H2>
      </div>
      <Spacer size='2xl' />
      <div className='flex flex-col gap-2'>
        <Label htmlFor='title'>Title</Label>
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
        <Label htmlFor='abstract'>Abstract</Label>
        <Input
          inputSize='base'
          onChange={(e) => setAbstract(e.target.value)}
          placeholder='Enter the abstract of the report'
          rounded='base'
          variant='light'
          value={abstract}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='documentType'>Document Type</Label>
        <Input
          inputSize='base'
          onChange={(e) => setDocumentType(e.target.value)}
          placeholder='Enter the document type of the report'
          rounded='base'
          variant='light'
          value={documentType}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='regionOrCountry'>Region or Country</Label>
        <Input
          inputSize='base'
          onChange={(e) => setRegionOrCountry(e.target.value)}
          placeholder='Enter the region or country of the report'
          rounded='base'
          variant='light'
          value={regionOrCountry}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='hdpTags'>HDP Tags</Label>
        <Input
          inputSize='base'
          onChange={(e) => setHdpTags(e.target.value)}
          placeholder='Enter the HDP tags of the report'
          rounded='base'
          variant='light'
          value={hdpTags}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='thematicTags'>Thematic Tags</Label>
        <Input
          inputSize='base'
          onChange={(e) => setThematicTags(e.target.value)}
          placeholder='Enter the thematic tags of the report'
          rounded='base'
          variant='light'
          value={thematicTags}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='dacRecommendation'>DAC Recommendation</Label>
        <Input
          inputSize='base'
          onChange={(e) => setDacRecommendation(e.target.value)}
          placeholder='Enter the DAC recommendation of the report'
          rounded='base'
          variant='light'
          value={dacRecommendation}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='affiliations'>Affiliations</Label>
        <Input
          inputSize='base'
          onChange={(e) => setAffiliations(e.target.value)}
          placeholder='Enter the affiliations of the report'
          rounded='base'
          variant='light'
          value={affiliations}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='authors'>Authors</Label>
        <Input
          inputSize='base'
          onChange={(e) => setAuthors(e.target.value)}
          placeholder='Enter the authors of the report'
          rounded='base'
          variant='light'
          value={authors}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='language'>Language</Label>
        <Input
          inputSize='base'
          onChange={(e) => setLanguage(e.target.value)}
          placeholder='Enter the language of the report'
          rounded='base'
          variant='light'
          value={language}
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
      <div className='flex flex-col gap-2'>
        <Label htmlFor='banner'>Banner</Label>
        <Input
          inputSize='base'
          onChange={(e) => setBanner(e.target.value)}
          placeholder='Enter the banner of the report'
          rounded='base'
          variant='light'
          value={banner}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='pdf'>PDF</Label>
        <Input
          inputSize='base'
          onChange={(e) => setPdf(e.target.value)}
          placeholder='Enter the PDF of the report'
          rounded='base'
          variant='light'
          value={pdf}
        />
      </div>
    </Container>
  );
}

export const Route = createLazyRoute('/query-demo')({
  component: AllReportsPage,
});
