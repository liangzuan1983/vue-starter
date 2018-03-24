export interface IFormValidResult {
  isValid: boolean;
  message?: string;
}

export interface IFormElement {
  type: string;
  pristine?: boolean;
  required?: boolean;
  inputType?: string;
  label?: string;
  model?: string;
  value?: any;
  elements?: IFormElement[];

  isValid?(element: IFormElement): IFormValidResult;
}

export interface IFormSchema {
  elements: IFormElement[];
  name?: string;
  id?: string;
  submitText?: string;
  cancellationText?: string;
}
