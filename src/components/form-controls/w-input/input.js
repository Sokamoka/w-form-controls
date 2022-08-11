import { findIndex, omit, propEq } from 'ramda';
import { computed, defineComponent, inject, onUnmounted, provide, reactive, ref, watch } from 'vue';
import { useId } from '../../../composables/use-id';
import { render } from '../../../utils/vnode/render';

export const InputControl = defineComponent({
  name: 'InputControl',

  props: {
    as: {
      type: String,
      default: 'div',
    },
  },

  setup() {
    const control = reactive({
      id: null,
      focus: false,
      empty: false,
    });

    provide(InputControlContext, control);

    return {
      control,
    };
  },

  render() {
    const slot = {
      id: this.control.id,
      focus: this.control.focus,
      empty: this.control.empty,
    };
    const slots = this.$scopedSlots;
    const data = { as: this.$props.as };

    return render({ data, slots, slot });
  },
});

export const InputWrapper = defineComponent({
  name: 'InputWrapper',

  props: {
    value: {
      type: [String, Number],
      default: '',
    },

    as: {
      type: String,
      default: 'div',
    },

    disabled: {
      type: Boolean,
      dafault: false,
    },

    readonly: {
      type: Boolean,
      dafault: false,
    },
  },

  setup(props, { emit }) {
    const inputWrapperRef = ref(null);
    const inputRef = ref(null);
    const isOnFocus = ref(false);
    const isValid = ref(true);
    const value = computed(() => props.value);

    const isEmpty = computed(() => props.value?.length === 0);

    const onFocusIn = (event) => {
      isOnFocus.value = true;
      emit('focus', event);
    };

    const onFocusOut = (event) => {
      isOnFocus.value = false;
      emit('blur', event);
    };

    const api = {
      value,
      inputRef,
      disabled: computed(() => props.disabled),
      readonly: computed(() => props.readonly),
      onInput(value) {
        emit('input', value);
      },
    };

    provide(InputContext, api);

    const control = useInputControl();
    if (control) {
      control.id = computed(() => api.inputRef?.value?.id);
      control.empty = isEmpty;
      control.focus = isOnFocus;
    }

    return {
      id: computed(() => api.inputRef?.value?.id),
      inputWrapperRef,
      isEmpty,
      isOnFocus,
      isValid,
      onFocusIn,
      onFocusOut,
    };
  },

  render() {
    const slot = {
      id: this.id,
      empty: this.isEmpty,
      focus: this.isOnFocus,
      disabled: this.disabled,
      readonly: this.readonly,
      valid: this.isValid,
    };
    const slots = this.$scopedSlots;
    const data = {
      as: this.$props.as,
      ref: 'inputWrapperRef',
      on: {
        focusin: this.onFocusIn,
        focusout: this.onFocusOut,
      },
    };

    return render({ data, slots, slot });
  },
});

export const InputInput = defineComponent({
  name: 'InputInput',

  props: {
    type: {
      type: String,
      default: 'text',
    },

    disabled: {
      type: Boolean,
      dafault: false,
    },

    readonly: {
      type: Boolean,
      dafault: false,
    },
  },

  setup(props) {
    const api = inject(InputContext, null);
    const id = `wa-input-${useId()}`;

    const value = computed(() => api.value);
    const isDisabled = computed(() => props.disabled || api.disabled.value);
    const isReadonly = computed(() => props.readonly || api.readonly.value);

    return {
      value,
      id,
      refEl: api.inputRef,
      isDisabled,
      isReadonly,
      onInput(event) {
        api.onInput(event.target.value);
      },
    };
  },

  render() {
    const listeners = omit(['input'], this.$listeners);
    const data = {
      as: 'input',
      ref: 'refEl',
      attrs: {
        id: this.id,
        type: this.$props.type,
        readonly: this.isReadonly,
      },
      domProps: {
        value: this.value.value,
        disabled: this.isDisabled,
      },
      on: {
        input: this.onInput,
        ...listeners,
      },
      ...this.$attrs,
    };
    const slots = this.$scopedSlots;

    return render({ data, slots, name: 'InputInput' });
  },
});

export const InputLabel = defineComponent({
  name: 'InputLabel',

  render() {
    const api = inject(InputContext, null);

    const data = {
      as: 'label',
      attrs: {
        for: api.inputRef?.value.id,
      },
    };
    const slots = this.$scopedSlots;

    return render({ data, slots, name: 'InputLabel' });
  },
});

export const InputGroup = defineComponent({
  name: 'InputGroup',

  setup() {
    const inputs = ref([]);
    const api = {
      inputs,
      register: (item) => inputs.value.push(item),
      unregister: (name) => {
        const index = findIndex(propEq('name', name))(inputs.value);
        if (index === -1) return;
        inputs.value.splice(index, 1);
      },
    };

    provide(InputGroupContext, api);

    return {
      inputs,
    };
  },

  render() {
    const data = { as: 'div' };
    const slot = { errors: this.inputs };
    const slots = this.$scopedSlots;

    return render({
      data,
      slots,
      slot,
      name: 'InputGroup',
    });
  },
});

export const useInputGroup = ({ name, message, inputId }) => {
  const api = inject(InputGroupContext, null);

  if (api && name) {
    watch(inputId, (id) => {
      if (!id) return;

      api.register({ id, name, message });
    });

    onUnmounted(() => api.unregister(name));
  }

  return {
    isInGroup: Boolean(api),
  };
};

export const useInputControl = () => {
  const control = inject(InputControlContext, null);
  return control;
};

const InputContext = Symbol('InputContext');
const InputGroupContext = Symbol('InputGroupContext');
const InputControlContext = Symbol('InputControlContext');
