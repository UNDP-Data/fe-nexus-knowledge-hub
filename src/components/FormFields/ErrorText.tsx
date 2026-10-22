import { P } from '@undp/design-system-react/Typography';

export function ErrorText({ errors }: { errors: string }) {
  return (
    <P className='mt-2 text-error' size='sm' marginBottom='none'>
      {errors}
    </P>
  );
}
