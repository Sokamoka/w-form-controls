import { findIndex, propEq, slice } from 'ramda';
import { inject, onUnmounted, provide, ref, watch } from 'vue';

const ExpandedFieldContext = Symbol('ExpandedFieldContext');
const PopperContentContext = Symbol('PopperContentContext');

export const usePopperContentProvider = (contentRef = ref(null)) => {
  const reference = ref(null);

  const api = {
    check: (event) => {
      return reference.value?.contains(event.relatedTarget);
    },
  };
  provide(PopperContentContext, api);

  watch(contentRef, (content) => {
    reference.value = content;
  });
};

export const usePopperContent = () => {
  const api = inject(PopperContentContext, null);
  return api?.check;
};

export const useExpandedFieldProvider = () => {
  const fields = ref([]);

  const api = {
    register: (item) => {
      fields.value.push(item);
    },
    unregister: (name) => {
      const index = findIndex(propEq('name', name))(fields.value);
      if (index === -1) return;
      slice(index, 1, fields.value);
    },
  };
  provide(ExpandedFieldContext, api);

  return {
    fields,
  };
};

export const useExpandedField = ({
  value,
  name,
  message,
  inputId,
  helperText,
  helperTextSrOnly,
  emitInput = () => ({}),
}) => {
  const api = inject(ExpandedFieldContext, null);

  if (!api || !name) return null;

  watch(inputId, (id) => {
    if (!id) return;
    api.register({ id, name, message, helperText, helperTextSrOnly });
  });
  onUnmounted(() => api?.unregister(name));

  // watch(value, () => {
  //   emitInput();
  // });

  return api;
};
