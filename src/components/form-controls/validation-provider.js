import { pick } from 'ramda';
import { computed, defineComponent, inject, watch } from 'vue';
import { render } from '../../utils/vnode/render';
import { useCollectErrorMessages } from './internal';

export const ValidationProvider = defineComponent({
  name: 'ValidationProvider',

  props: {
    value: {
      type: [String, Object, Date],
      default: '',
    },

    name: {
      type: String,
      required: true,
    },

    scope: {
      type: String,
      default: '',
    },

    errorMessage: {
      type: String,
      default: '',
    },
  },

  setup(props, { emit }) {
    const validator = inject('$validator', {});

    const modelValue = computed(() => props.value);

    const validatorFieldFlags = computed(() => {
      const field = validator.fields.find({
        name: props.name,
        ...(props.scope && { scope: props.scope }),
      });
      return pick(['touched', 'dirty', 'valid', 'pending', 'validated'], field?.flags ?? {});
    });

    const validatorFieldErrorMessage = computed(() => {
      if (props.scope) return validator.errors.first(props.name, props.scope);
      return props.errorMessage || validator.errors.first(props.name);
    });

    const hasError = computed(() => {
      const { valid, validated } = validatorFieldFlags.value;
      return !valid && validated;
    });

    const isValid = computed(() => {
      return validatorFieldFlags.value.valid;
    });

    watch(modelValue, () => {
      emit('input');
    });

    useCollectErrorMessages({ name: props.name, message: validatorFieldErrorMessage });

    return {
      flags: validatorFieldFlags,
      message: validatorFieldErrorMessage,
      error: hasError,
      valid: isValid,
      input: () => emit('input'),
      blur: () => emit('blur'),
    };
  },

  render() {
    const slot = {
      flags: this.flags,
      error: this.error,
      valid: this.valid,
      message: this.message,
      inputEvents: {
        input: this.input,
        blur: this.blur,
      },
    };
    const slots = this.$scopedSlots;
    const data = {
      as: 'template',
    };

    return render({ data, slots, slot });
  },
});
