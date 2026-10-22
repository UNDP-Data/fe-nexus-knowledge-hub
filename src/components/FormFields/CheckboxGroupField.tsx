import { CheckboxGroup, CheckboxGroupItem } from '@undp/design-system-react/CheckboxGroup';
import { useFieldContext } from '@/lib/form-context';
import { ErrorText } from './ErrorText';

export function CheckboxGroupField({
  label,
  options,
  isRequired = false,
}: {
  label: string;
  isRequired?: boolean;
  options: { label: string; value: string }[];
}) {
  const field = useFieldContext<string[]>();
  return (
    <label htmlFor={label.toLowerCase()}>
      {label}
      {isRequired && <span className='text-accent-red-700'>*</span>}
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
