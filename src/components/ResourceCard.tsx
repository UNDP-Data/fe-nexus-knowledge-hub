import { Badge } from '@undp/design-system-react/Badge';
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
import { Spacer } from '@undp/design-system-react/Spacer';
import { P } from '@undp/design-system-react/Typography';
import { FileText } from 'lucide-react';
import type { Publication } from '@/Types';

export function ResourceCard({
  resource,
  isUserAdmin = false,
}: {
  resource: Publication;
  isUserAdmin?: boolean;
}) {
  return (
    <Card backgroundColor='background' size='full' variant='with-image' className='h-full'>
      <CardHeader>
        <CardTag className='pb-4!'>{resource.document_type}</CardTag>
        <CardImage
          src={
            resource.assets?.find((el) => el.role === 'banner')?.url ||
            'https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        />
        <CardTitle>
          <div>
            <div className='flex flex-wrap gap-2'>
              <Badge
                size='lg'
                rounded='full'
                color='secondary'
                className='bg-secondary/20 px-4 py-1'
              >
                <div className='flex items-center gap-2 text-blue-700'>
                  <FileText size={16} />
                  {resource.document_type}
                </div>
              </Badge>
              <Badge size='lg' rounded='full' color='surface-sm' className='px-4 py-1'>
                {resource.publication_year}
              </Badge>
              {isUserAdmin && (
                <Badge
                  className='w-fit'
                  color={
                    resource.status === 'approved'
                      ? 'success'
                      : resource.status === 'rejected'
                        ? 'error'
                        : resource.status === 'pending'
                          ? 'warning'
                          : 'background'
                  }
                >
                  {resource.status.replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
              )}
            </div>
            <Spacer size='xl' />
            <P className='line-clamp-2' weight='bold' size='lg' marginBottom='none'>
              {resource.title}
            </P>
          </div>
        </CardTitle>
        <CardDescription>
          <P className='line-clamp-3' size='base' marginBottom='none'>
            {resource.abstract_md || 'No abstract available'}
          </P>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button padding='none' variant='link'>
          Read more
        </Button>
      </CardFooter>
    </Card>
  );
}
