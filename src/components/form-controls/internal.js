import { findIndex, propEq, slice } from 'ramda';
import { computed, inject, onMounted, onUnmounted, provide, ref, unref, watch, watchEffect } from 'vue';

export const CollectErrorMessages = Symbol('CollectErrorMessages');
export const ExpandedFieldContext = Symbol('ExpandedFieldContext');

export const useErrorMessageProvider = () => {
  const inputs = ref([]);

  const api = {
    inputs,
    register: (item) => {
      inputs.value.push(item);
    },
    unregister: (name) => {
      const index = findIndex(propEq('name', name))(inputs.value);
      if (index === -1) return;
      // inputs.value.splice(index, 1);
      slice(index, 1, inputs.value);
    },
  };

  provide(CollectErrorMessages, api);

  return {
    messages: inputs,
  };
};

export const useCollectErrorMessages = ({ name, message }) => {
  const api = inject(CollectErrorMessages, null);

  // watchEffect(() => {
  //   console.log('WATCHEFFECT');
  // });

  onMounted(() => api?.register({ name, message }));
  onUnmounted(() => api?.unregister(name));
};

export const useExpandedFieldProvider = ({ contentRef }) => {
  const fields = ref([]);
  const reference = ref(null);

  const api = {
    register: (item) => {
      fields.value.push(item);
    },
    unregister: (name) => {
      const index = findIndex(propEq('name', name))(fields.value);
      if (index === -1) return;
      // inputs.value.splice(index, 1);
      slice(index, 1, fields.value);
    },
    check: (event) => {
      return reference.value.contains(event.relatedTarget);
    },
  };
  provide(ExpandedFieldContext, api);

  watch(contentRef, (content) => {
    reference.value = content;
  });

  return {
    fields: fields,
    errors: computed(() => fields.value.map((field) => field?.message)),
  };
};

export const useExpandedField = ({ value, name, message, inputId, helperText, emitInput }) => {
  const api = inject(ExpandedFieldContext, null);

  if (!api || !name) return { api: null };
  watch(inputId, (id) => {
    if (!id) return;
    api.register({ id, name, message, helperText });
  });
  onUnmounted(() => api?.unregister(name));

  // VeeValidate miatt kell, ha változik a value
  watch(value, () => {
    emitInput();
  });

  return {
    api,
  };
};
