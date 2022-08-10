import { inject } from 'vue';

export const ExternalValidationContext = Symbol('ExternalValidationContext');

export const useExternalValidation = ({ blur = () => ({}), input = () => ({}) }) => {
  const api = inject(ExternalValidationContext, null);
  if (api) {
    api.register({ blur, input });
  }
  return {
    hasExternalValidation: Boolean(api),
  };
};
