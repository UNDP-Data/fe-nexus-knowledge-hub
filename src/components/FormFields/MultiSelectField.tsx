import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Spacer } from '@undp/design-system-react/Spacer';
import { P } from '@undp/design-system-react/Typography';
import { useFieldContext } from '@/lib/form-context';
import { FilterSkeleton } from '../Skeleton';
import { ErrorText } from './ErrorText';

export function MultiSelectField({
  label,
  placeholder,
  options,
  isRequired = false,
  isLoading = false,
}: {
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  options?: { label: string; value: string }[];
}) {
  const field = useFieldContext<string[]>();
  if (isLoading || !options) {
    return <FilterSkeleton noOfFIlter={1} />;
  }
  const selected = options.filter((opt) => (field.state.value ?? []).includes(opt.value));
  return (
    <label htmlFor={label.toLowerCase()}>
      <P marginBottom='none' size='sm'>
        {label}
        {isRequired && <span className='text-error'>*</span>}
      </P>
      <Spacer size='sm' />
      <DropdownSelect
        id={label.toLowerCase()}
        color='primary'
        placeholder={placeholder}
        onChange={(options) =>
          field.handleChange(
            // biome-ignore lint/suspicious/noExplicitAny: Need to fix in the library
            (options as any)?.map((o: any) => o.value),
          )
        }
        options={options}
        value={selected}
        showCheck
        isSearchable
        isMulti={true}
        size='sm'
        className={`${field.state.meta.errors.length > 0 ? 'border-error!' : ''}`}
      />
      {!field.state.meta.isValid && (
        <ErrorText errors={field.state.meta.errors.map((e) => e?.message ?? e).join(', ')} />
      )}
    </label>
  );
}
