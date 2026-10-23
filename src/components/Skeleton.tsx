import { Grid, GridItem } from '@undp/design-system-react/Grid';
import { Spacer } from '@undp/design-system-react/Spacer';

const pulse = 'animate-pulse rounded bg-surface';

export function FilterSkeleton({ noOfFIlter = 8 }: { noOfFIlter?: number }) {
  return (
    <div aria-busy='true' aria-live='polite' className='w-full'>
      <span className='sr-only'>Loading resources…</span>
      <div className='flex w-full flex-wrap items-center gap-4'>
        {Array.from({ length: noOfFIlter }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: index is unique
          <div className='w-full min-w-50' key={i}>
            <div className={`${pulse} mb-1 h-3 w-32`} />
            <div className={`${pulse} h-9 w-full`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <GridItem noOfColSpan={{ base: 1, sm: 1, md: 1 }}>
      <div className='flex h-full flex-col bg-background'>
        <div className={`${pulse} aspect-video w-full rounded-none`} />
        <div className='flex flex-1 flex-col gap-3 p-6'>
          <div className='flex gap-2'>
            <div className={`${pulse} h-7 w-28 rounded-full`} />
            <div className={`${pulse} h-7 w-16 rounded-full`} />
          </div>
          <Spacer size='xs' />
          <div className={`${pulse} h-5 w-full`} />
          <div className={`${pulse} h-5 w-3/4`} />
          <Spacer size='xs' />
          <div className={`${pulse} h-4 w-full`} />
          <div className={`${pulse} h-4 w-full`} />
          <div className={`${pulse} h-4 w-2/3`} />
          <div className={`${pulse} mt-auto h-4 w-20`} />
        </div>
      </div>
    </GridItem>
  );
}

export function CardGridSkeleton({ numberOfCards = 32 }: { numberOfCards?: number }) {
  return (
    <div aria-busy='true' aria-live='polite'>
      <span className='sr-only'>Loading resources…</span>
      <Grid
        gap='32px'
        noOfCol={{
          base: 1,
          md: 3,
          xl: 4,
          sm: 2,
        }}
      >
        {Array.from({ length: numberOfCards }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: index is unique
          <CardSkeleton key={i} />
        ))}
      </Grid>
    </div>
  );
}
