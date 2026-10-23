import { FileUpload } from '@undp/design-system-react/FileUpload';
import { FileIcon } from 'lucide-react';
import { useFieldContext } from '@/lib/form-context';
import { ErrorText } from './ErrorText';

export function MultipleFileUpload({
  label,
  text,
  acceptFiles,
  isRequired = false,
}: {
  label: string;
  text?: string;
  acceptFiles?: string;
  isRequired?: boolean;
}) {
  const field = useFieldContext<File[]>();
  return (
    <label htmlFor={label.toLowerCase()}>
      {label}
      {isRequired && <span className='text-error'>*</span>}
      <FileUpload
        id={label.toLowerCase()}
        accept={acceptFiles ?? '*/*'}
        multiple={false}
        value={field.state.value}
        onFileChange={(files) => {
          field.handleChange(files);
        }}
      >
        <div className='flex w-full cursor-pointer items-center justify-start gap-2 bg-surface p-6 hover:bg-surface-hover'>
          <FileIcon />
          {text ?? 'Upload the report here'}
        </div>
      </FileUpload>
      {!field.state.meta.isValid && (
        <ErrorText errors={field.state.meta.errors.map((e) => e?.message ?? e).join(', ')} />
      )}
    </label>
  );
}
