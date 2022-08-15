import { findIndex, propEq, slice } from 'ramda';
import { inject, onUnmounted, provide, ref, watch } from 'vue';

export const ExpandedFieldContext = Symbol('ExpandedFieldContext');

export const useExpandedFieldProvider = ({ contentRef = ref(null) }) => {
  const fields = ref([]);
  const reference = ref(null);

  const api = {
    register: (item) => {
      fields.value.push(item);
    },
    unregister: (name) => {
      const index = findIndex(propEq('name', name))(fields.value);
      if (index === -1) return;
      slice(index, 1, fields.value);
    },
    check: (event) => {
      return reference.value?.contains(event.relatedTarget);
    },
  };
  provide(ExpandedFieldContext, api);

  watch(contentRef, (content) => {
    reference.value = content;
  });

  return {
    fields: fields,
  };
};

export const useExpandedField = ({ name, message, inputId, helperText, helperTextSrOnly }) => {
  const api = inject(ExpandedFieldContext, null);

  if (!api || !name) return null;
  watch(inputId, (id) => {
    if (!id) return;
    api.register({ id, name, message, helperText, helperTextSrOnly });
  });
  onUnmounted(() => api?.unregister(name));

  return api;
};
