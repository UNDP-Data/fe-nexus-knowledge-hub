import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
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
      {label}
      {isRequired && <span className='text-error'>*</span>}
      <DropdownSelect
        id={label.toLowerCase()}
        color='primary'
        placeholder={placeholder}
        variant='light'
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
      />
      {!field.state.meta.isValid && (
        <ErrorText errors={field.state.meta.errors.map((e) => e?.message ?? e).join(', ')} />
      )}
    </label>
  );
}
