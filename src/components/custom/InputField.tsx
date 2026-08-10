import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";




export function InputField(label: string, desc: string, placeholder: string) {



  return (
    <Field>
      <FieldLabel htmlFor="input-field-username">${label}</FieldLabel>
      <Input
        id="input-field-username"
        type="text"
        placeholder=""
      />
      <FieldDescription>
        ${desc}
      </FieldDescription>
    </Field>
  );
}
