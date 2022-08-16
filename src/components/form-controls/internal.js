import { noop } from '@vueuse/core';
import { findIndex, propEq, slice } from 'ramda';
import { inject, onUnmounted, provide, ref, watch } from 'vue';

const ExpandedFieldContext = Symbol('ExpandedFieldContext');
const PopperContentContext = Symbol('PopperContentContext');

export const usePopperContentProvider = (contentRef = ref(null)) => {
  const reference = ref(null);
  let inputEvent = noop;

  const api = {
    inputEvent: (handler) => {
      console.log('handler');
      inputEvent = handler;
    },
    onInput: () => {
      console.log('onInput');
      inputEvent();
    },
    check: (event) => {
      return reference.value?.contains(event.relatedTarget);
    },
  };
  provide(PopperContentContext, api);

  watch(contentRef, (content) => {
    reference.value = content;
  });

  return {
    onInput: api.onInput,
  };
};

export const usePopperContent = (leaveEventHandler = () => noop) => {
  const api = inject(PopperContentContext, null);

  api?.inputEvent(leaveEventHandler);
  return api?.check;
};

export const useExpandedFieldProvider = () => {
  const isEmbeded = inject(ExpandedFieldContext, null);
  if (isEmbeded) return {};

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
