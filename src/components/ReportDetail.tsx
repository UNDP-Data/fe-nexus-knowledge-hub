import { Badge } from '@undp/design-system-react/Badge';
import { Button } from '@undp/design-system-react/Button';
import { MarkdownRenderer } from '@undp/design-system-react/MarkdownRenderer';
import { Spacer } from '@undp/design-system-react/Spacer';
import { H3, P } from '@undp/design-system-react/Typography';
import { Calendar, FileText } from 'lucide-react';
import { DAC_COLORS, HDP_TAG_COLORS, IMG_URL, REPORT_URL } from '@/constants';
import type { DocumentFormattedDataType } from '@/Types';

const isUrl = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

export function ReportDetail({ report }: { report: DocumentFormattedDataType }) {
  return (
    <>
      <div
        className='flex min-h-75 w-full items-center rounded-lg bg-center bg-cover p-8'
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${
            report.Banner
              ? `${IMG_URL}/${report.Banner}`
              : 'https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop'
          }")`,
        }}
      >
        <div>
          <H3 weight='bold' marginBottom='base' className='text-content-reverse'>
            {report.Title}
          </H3>
          <div className='flex gap-2'>
            <Badge size='lg' rounded='md' variant='secondary'>
              <div className='flex items-center gap-1'>
                <FileText size={12} />
                {report['Document Type']}
              </div>
            </Badge>
            <Badge size='lg' rounded='md' variant='secondary'>
              <div className='flex items-center gap-1'>
                <Calendar size={12} />
                {report['Publication Year']}
              </div>
            </Badge>
          </div>
        </div>
      </div>
      {report.Abstract && (
        <>
          <Spacer size='2xl' />
          <div className='flex flex-col gap-2'>
            <P className='text-content-tertiary' size='base' marginBottom='none'>
              Abstract
            </P>
            <MarkdownRenderer
              text={report.Abstract || ''}
              classNames={{
                p: 'text-base text-content-secondary mb-0',
              }}
            />
          </div>
        </>
      )}
      {report['Region / Country']?.length > 0 && (
        <>
          <Spacer size='2xl' />
          <div className='flex flex-col gap-2'>
            <P className='text-content-tertiary' size='base' marginBottom='none'>
              Region / Country
            </P>
            <div className='flex flex-wrap gap-2'>
              {report['Region / Country'].map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
        </>
      )}
      {report['HDP Tags']?.length && (
        <>
          <Spacer size='2xl' />
          <div className='flex flex-col gap-2'>
            <P className='text-content-tertiary' size='base' marginBottom='none'>
              HDP Tags
            </P>
            <div className='flex flex-wrap gap-2'>
              {report['HDP Tags'].map((item) => (
                <Badge
                  key={item}
                  variant={
                    HDP_TAG_COLORS.find((d) => d.id === item)?.color as 'green' | 'blue' | 'orange'
                  }
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
      {report['DAC Recommendation']?.length && (
        <>
          <Spacer size='2xl' />
          <div className='flex flex-col gap-2'>
            <P className='text-content-tertiary' size='base' marginBottom='none'>
              DAC Recommendation
            </P>
            <div className='flex flex-wrap gap-2'>
              {report['DAC Recommendation'].map((item) => (
                <Badge
                  key={item}
                  variant={
                    DAC_COLORS.find((d) => item.includes(d.id))?.color as 'teal' | 'azure' | 'lime'
                  }
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
      {report.Authors && (
        <>
          <Spacer size='2xl' />
          <div className='flex flex-col gap-2'>
            <P className='text-content-tertiary' size='base' marginBottom='none'>
              Author
            </P>
            <div className='flex flex-wrap gap-2'>
              <P marginBottom='none' size='base'>
                {report.Authors}
              </P>
            </div>
          </div>
        </>
      )}
      {report.Affiliations && (
        <>
          <Spacer size='2xl' />
          <div className='flex flex-col gap-2'>
            <P className='text-content-tertiary' size='base' marginBottom='none'>
              Affiliations
            </P>
            <div className='flex flex-wrap gap-2'>
              <P marginBottom='none' size='base'>
                {report.Affiliations}
              </P>
            </div>
          </div>
        </>
      )}
      {(report.PDF || isUrl(report.Link)) && (
        <>
          <Spacer size='2xl' />
          <Button variant='link' padding='none'>
            <a
              href={
                report.PDF ? `${REPORT_URL}/${report.PDF}` : isUrl(report.Link) ? report.Link : ''
              }
              target='_blank'
              rel='noopener noreferrer'
            >
              Click here to learn more
            </a>
          </Button>
        </>
      )}
    </>
  );
}
