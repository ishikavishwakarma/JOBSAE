import React from 'react';
import { 
  FormInput, 
  FormPasswordInput, 
  FormSelect, 
  FormSearchableSelect, 
  FormMultiSelect 
} from './form-fields';

/**
 * DynamicFormField maps a field type string to the corresponding reusable component.
 */
export const DynamicFormField = ({ field, form }) => {
  const { type, ...rest } = field;

  switch (type) {
    case 'text':
    case 'email':
    case 'number':
    case 'tel':
    case 'url':
      return <FormInput form={form} type={type} {...rest} />;
    
    case 'password':
      return <FormPasswordInput form={form} {...rest} />;
    
    case 'select':
      return <FormSelect form={form} {...rest} />;
    
    case 'searchable':
      return <FormSearchableSelect form={form} {...rest} />;
    
    case 'multi':
      return <FormMultiSelect form={form} {...rest} />;
    
    default:
      console.warn(`Unknown field type: ${type}`);
      return <FormInput form={form} {...rest} />;
  }
};

/**
 * DynamicForm renders a list of field definitions.
 */
export const DynamicForm = ({ fields, form, className = "flex flex-col gap-4" }) => {
  return (
    <div className={className}>
      {fields.map((field) => (
        <DynamicFormField key={field.name} field={field} form={form} />
      ))}
    </div>
  );
};
