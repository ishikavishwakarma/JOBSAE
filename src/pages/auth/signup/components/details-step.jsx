import { UserCog } from 'lucide-react';
import { DynamicForm } from './dynamic-form';
import { StepHeader } from './form-fields';

export function DetailsStep({ form, config }) {
  const isEmployer = form.watch('role') === 'employer';

  const salutationOptions = [
    { label: "Mr.", value: "Mr." },
    { label: "Mrs.", value: "Mrs." },
    { label: "Ms.", value: "Ms." },
    { label: "Dr.", value: "Dr." },
    { label: "Prof.", value: "Prof." },
  ];

  const suffixOptions = [
    { label: "None", value: "none" },
    { label: "Jr.", value: "Jr." },
    { label: "Sr.", value: "Sr." },
    { label: "II", value: "II" },
    { label: "III", value: "III" },
    { label: "IV", value: "IV" },
  ];

  const fields = [
    // Conditionally include company name
    ...(isEmployer ? [{
      type: 'text',
      name: 'companyName',
      placeholder: 'Company Name',
      required: true
    }] : []),
    {
      type: 'select',
      name: 'salutation',
      placeholder: 'Salutation',
      options: salutationOptions
    },
    {
      type: 'text',
      name: 'firstName',
      placeholder: 'First Name',
      required: true
    },
    {
      type: 'text',
      name: 'middleName',
      placeholder: 'Middle Name (Optional)'
    },
    {
      type: 'text',
      name: 'lastName',
      placeholder: 'Last Name',
      required: true
    },
    {
      type: 'select',
      name: 'suffix',
      placeholder: 'Suffix',
      options: suffixOptions
    }
  ];

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <StepHeader 
        title={config?.title} 
        subtitle={config?.subtitle} 
      />

      <div className="w-full max-w-md">
        <DynamicForm fields={fields} form={form} />
      </div>
    </div>
  );
}
