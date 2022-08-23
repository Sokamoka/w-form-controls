import { noop } from '@vueuse/core';
import { findIndex, isEmpty, propEq, slice } from 'ramda';
import { computed, inject, onUnmounted, provide, ref, watch } from 'vue';

export const INPUT_TYPES = [
  'date',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week',
];

const ExpandedFieldContext = Symbol('ExpandedFieldContext');
const PopperContentContext = Symbol('PopperContentContext');

export const usePopperContentProvider = ({ triggerRef, contentRef }) => {
  const api = {
    check: (event) => {
      if (triggerRef?.contains(event.relatedTarget)) return true;
      return contentRef.value?.contains(event.relatedTarget);
    },
  };
  provide(PopperContentContext, api);
};

export const usePopperContent = (handler = () => noop) => {
  const api = inject(PopperContentContext, null);

  const onBlur = (event) => {
    if (api?.check(event)) return;
    handler(event);
  };
  return onBlur;
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
    hasError: computed(() => !isEmpty(fields.value.filter((field) => Boolean(field?.message)))),
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
