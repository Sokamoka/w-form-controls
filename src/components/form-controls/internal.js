import { inject, provide, ref, unref, watch } from 'vue';

export const ExternalValidationContext = Symbol('ExternalValidationContext');
export const ExternalPopperContext = Symbol('ExternalPopperContext');

export const useExternalValidation = ({ blur = () => ({}), input = () => ({}) }) => {
  const api = inject(ExternalValidationContext, null);
  if (api) {
    api.register({ blur, input });
  }
  return {
    hasExternalValidation: Boolean(api),
  };
};

export const useExternalPopperProvider = ({ value, contentRef }) => {
  const reference = ref();

  const api = {
    value,
    input: () => {
      console.log('NOOP');
    },
    check: (event) => {
      return reference.value.contains(event.relatedTarget);
    },
  };

  watch(contentRef, (content) => {
    reference.value = content;
  });

  provide(ExternalPopperContext, api);

  return {
    inputEvent: api.input,
  };
};

export const useExternalPopper = ({ value, input = () => ({}) }) => {
  const api = inject(ExternalPopperContext, null);

  if (api) {
    // api.input = input;
  }

  watch(value, (val) => {
    if (!api) return;
    input(val);
  });

  return {
    api,
    hasExternalPopper: Boolean(api),
  };
};
