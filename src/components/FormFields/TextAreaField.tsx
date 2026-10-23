import { Textarea } from '@undp/design-system-react/Textarea';
import { useFieldContext } from '@/lib/form-context';
import { ErrorText } from './ErrorText';

export function TextAreaField({
  label,
  placeholder,
  isRequired = false,
}: {
  label: string;
  placeholder?: string;
  isRequired?: boolean;
}) {
  const field = useFieldContext<string>();
  return (
    <label htmlFor={label.toLowerCase()}>
      {label}
      {isRequired && <span className='text-error'>*</span>}
      <Textarea
        id={label.toLowerCase()}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        rounded='base'
        variant='light'
        value={field.state.value}
        className='w-full'
      />
      {!field.state.meta.isValid && (
        <ErrorText errors={field.state.meta.errors.map((e) => e?.message ?? e).join(', ')} />
      )}
    </label>
  );
}
