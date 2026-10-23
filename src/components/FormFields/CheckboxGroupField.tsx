import { CheckboxGroup, CheckboxGroupItem } from '@undp/design-system-react/CheckboxGroup';
import { useFieldContext } from '@/lib/form-context';
import { FilterSkeleton } from '../Skeleton';
import { ErrorText } from './ErrorText';

export function CheckboxGroupField({
  label,
  options,
  isLoading = false,
  isRequired = false,
}: {
  label: string;
  isLoading?: boolean;
  options?: { label: string; value: string }[];
  isRequired?: boolean;
}) {
  const field = useFieldContext<string[]>();
  if (isLoading || !options) {
    return <FilterSkeleton noOfFIlter={1} />;
  }
  return (
    <label htmlFor={label.toLowerCase()}>
      {label}
      {isRequired && <span className='text-error'>*</span>}
      <CheckboxGroup
        id={label.toLowerCase()}
        color='primary'
        onValueChange={(d) => {
          field.handleChange(d);
        }}
        value={field.state.value}
        rounded='base'
      >
        {options.map((item) => (
          <CheckboxGroupItem key={item.value} label={item.label} value={item.value} />
        ))}
      </CheckboxGroup>
      {!field.state.meta.isValid && (
        <ErrorText errors={field.state.meta.errors.map((e) => e?.message ?? e).join(', ')} />
      )}
    </label>
  );
}
