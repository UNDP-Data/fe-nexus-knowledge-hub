import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { useFieldContext } from '@/lib/form-context';
import { ErrorText } from './ErrorText';

export function MultiSelectField({
  label,
  placeholder,
  options,
  isRequired = false,
}: {
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  options: { label: string; value: string }[];
}) {
  const field = useFieldContext<string[]>();
  const selected = options.filter((opt) => (field.state.value ?? []).includes(opt.value));
  return (
    <label htmlFor={label.toLowerCase()}>
      {label}
      {isRequired && <span className='text-accent-red-700'>*</span>}
      <DropdownSelect
        id={label.toLowerCase()}
        color='primary'
        placeholder={placeholder}
        variant='light'
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
      />
      {!field.state.meta.isValid && (
        <ErrorText errors={field.state.meta.errors.map((e) => e?.message ?? e).join(', ')} />
      )}
    </label>
  );
}
