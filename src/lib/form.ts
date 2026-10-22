// src/lib/form.ts
import { createFormHook } from '@tanstack/react-form';
import * as fieldComponents from '@/components/FormFields';
import { fieldContext, formContext } from '@/lib/form-context';

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents,
  formComponents: {},
});
