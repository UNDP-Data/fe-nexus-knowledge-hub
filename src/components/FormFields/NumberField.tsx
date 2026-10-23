import { Input } from '@undp/design-system-react/Input';
import { Spacer } from '@undp/design-system-react/Spacer';
import { P } from '@undp/design-system-react/Typography';
import { useFieldContext } from '@/lib/form-context';
import { ErrorText } from './ErrorText';

export function NumberField({
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
      <P marginBottom='none' size='sm'>
        {label}
        {isRequired && <span className='text-error'>*</span>}
      </P>
      <Spacer size='sm' />
      <Input
        id={label.toLowerCase()}
        inputSize='base'
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        rounded='base'
        value={field.state.value}
        className='w-full'
      />
      {!field.state.meta.isValid && (
        <ErrorText errors={field.state.meta.errors.map((e) => e?.message ?? e).join(', ')} />
      )}
    </label>
  );
}
