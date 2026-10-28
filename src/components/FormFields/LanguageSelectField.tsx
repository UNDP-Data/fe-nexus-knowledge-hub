import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Spacer } from '@undp/design-system-react/Spacer';
import { P } from '@undp/design-system-react/Typography';
import { useFieldContext } from '@/lib/form-context';
import { FilterSkeleton } from '../Skeleton';
import { ErrorText } from './ErrorText';

export function LanguageSelectField({
  label,
  placeholder,
  options,
  isLoading = false,
  isRequired = false,
}: {
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  options?: { label: string; value: string }[];
  isLoading?: boolean;
}) {
  const field = useFieldContext<{ name: string; code: string }[]>();
  if (isLoading || !options) {
    return <FilterSkeleton noOfFIlter={1} />;
  }
  const selected = options.filter((opt) =>
    (field.state.value ?? []).map((el) => el.code).includes(opt.value),
  );
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
            (options as any)?.map((o: any) => ({ code: o.value, name: o.label })),
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
