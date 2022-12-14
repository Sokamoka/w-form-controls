<template>
  <InputControl class="w-input-control" v-slot:default="{ id, empty }">
    <InputWrapper
      v-model="modelValue"
      :class="[
        'w-input-wrapper',
        {
          'is-disabled': disabled,
          'is-error': hasError,
        },
      ]"
      :disabled="disabled"
      :readonly="readonly"
      :handle-focusout="Boolean(name)"
      @blur="onBlur"
    >
      <slot name="prepend" />

      <div class="w-input-container">
        <div v-if="!empty && hint" class="hint">{{ hint }}</div>
        <InputInput
          ref="inputRef"
          :type="type"
          :name="name"
          :placeholder="currentPlaceholder"
          :aria-describedby="ariaDescribedby || `${id}-help`"
          :aria-invalid="error ? true : null"
          v-bind="$attrs"
          v-on="$listeners"
        />
        <InputLabel>{{ label }}</InputLabel>
      </div>
      <CheckIcon v-if="isValid" class="valid-icon" />

      <slot name="append" />
    </InputWrapper>
    <HelperText
      v-if="isHelperVisible"
      :id="`${id}-help`"
      :error="hasError"
      :text="hasError ? currentErrorMessage : helperText"
      :helper-sr-only="helperTextSrOnly"
    />
  </InputControl>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { CheckIcon } from '@vue-hero-icons/outline';
import { InputControl, InputWrapper, InputInput, InputLabel } from './input';
import useVeeValidator from '~/composables/use-vee-validator.js';
import HelperText from './helper-text.vue';
import { useExpandedField, usePopperContent, INPUT_TYPES } from '../internal';

export default {
  name: 'W-Input',

  inheritAttrs: false,

  components: {
    CheckIcon,
    InputLabel,
    InputInput,
    HelperText,
    InputWrapper,
    InputControl,
  },

  props: {
    value: {
      type: [String, Number, Date],
      default: '',
    },

    name: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      default: 'text',
      validator: (value) => INPUT_TYPES.includes(value),
    },

    label: {
      type: String,
      default: '',
    },

    placeholder: {
      type: String,
      default: '',
    },

    hint: {
      type: String,
      default: '',
    },

    valid: {
      type: Boolean,
      default: false,
    },

    error: {
      type: Boolean,
      default: false,
    },

    errorMessage: {
      type: String,
      default: '',
    },

    helperText: {
      type: String,
      default: '',
    },

    helperTextSrOnly: {
      type: Boolean,
      default: false,
    },

    helperTextDisabled: {
      type: Boolean,
      dafault: false,
    },

    disabled: {
      type: Boolean,
      dafault: false,
    },

    readonly: {
      type: Boolean,
      dafault: false,
    },

    scope: {
      type: String,
      default: '',
    },

    ariaDescribedby: {
      type: String,
      default: '',
    },

    maskedValue: {
      type: String,
      default: '',
    },
  },

  setup(props, { emit }) {
    const inputRef = ref(null);

    const internalValue = ref(null);

    const currentPlaceholder = computed(() => (props.placeholder ? props.placeholder : props.label));

    const modelValue = computed({
      get() {
        return props.maskedValue || props.value?.toString();
      },
      set(value) {
        if (props.maskedValue) return;
        internalValue.value = value;
        emit('input', value);
      },
    });

    const {
      message: validatorFieldErrorMessage,
      error: hasError,
      valid: isValid,
    } = useVeeValidator({
      name: props.name,
      scope: props.scope,
      error: computed(() => props.error),
      valid: computed(() => props.valid),
    });

    const currentErrorMessage = computed(() => {
      if (hasError.value && props.errorMessage) return props.errorMessage;
      return validatorFieldErrorMessage.value;
    });

    // VeeValidate miatt kell, ha v??ltozik a value
    watch(
      () => props.value,
      (value) => {
        if (!props.name) return;
        if (value === internalValue.value) return;
        emit('blur', value);
      }
    );

    // VeeValidate miatt kell egy blur event emit, hogy a validator valid??lni tudja a mez??t.
    const onBlur = usePopperContent((event) => emit('blur', event));

    const expandedField = useExpandedField({
      name: props.name,
      message: currentErrorMessage,
      inputId: computed(() => `${inputRef.value?.id}-help`),
      helperText: props.helperText,
      helperTextSrOnly: props.helperTextSrOnly,
    });

    const isHelperVisible = computed(() => {
      if (expandedField) return false;
      if (props.helperTextDisabled) return false;
      if (hasError.value) return true;
      if (!props.helperText) return false;
      return true;
    });

    return {
      inputRef,
      modelValue,
      currentPlaceholder,
      hasError,
      isValid,
      validatorFieldErrorMessage,
      currentErrorMessage,
      isHelperVisible,
      onBlur,
    };
  },
};
</script>

<style lang="scss" scoped>
.w-input-control {
  flex: 1;
}

.w-input-wrapper {
  display: inline-flex;
  position: relative;
  width: 100%;
  align-items: center;
  border: 1px solid #999;
  border-radius: 5px;
  box-sizing: border-box;
  transition: padding 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out,
    background-color 0.2s ease-in-out;
}

.w-input-container {
  position: relative;
  display: flex;
  flex: 1;
}

.w-input-wrapper input {
  flex: 1;
  padding: 20px;
  font-size: 16px;
  line-height: 20px;
  border: none;
  outline: none;
  background: none;
  transition: padding 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.w-input-wrapper label {
  position: absolute;
  left: 0;
  top: 0;
  padding: 10px 20px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 700;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.w-input-wrapper .hint {
  position: absolute;
  left: 0;
  top: 0;
  padding: 30px 20px 10px;
  font-size: 16px;
  line-height: 20px;
  pointer-events: none;
  opacity: 0.3;
}

.w-input-wrapper input:not(:placeholder-shown) {
  padding: 30px 20px 10px;
}
.w-input-wrapper input:placeholder-shown + label {
  opacity: 0;
}

.w-input-wrapper:focus-within {
  background-color: #fff;
  border-color: #999;
  box-shadow: inset 0 0 0 1px #999, 0 4px 15px rgba(0, 0, 0, 0.25);
}

// .w-input-wrapper.is-group:focus-within {
//   box-shadow: inset 0 0 0 1px #999;
// }

.w-input-wrapper .valid-icon {
  stroke: #48cb40;
  width: 20px;
  height: 20px;
  margin: 0 8px;
}

.w-input-wrapper.is-disabled {
  background-color: #f2f2f2;
}

.w-input-wrapper.is-error {
  background-color: $color-rf-pink-mindblowinglylight;
  border-color: $color-pink-basic;
  box-shadow: inset 0 0 0 1px $color-pink-basic, 0 0 10px rgba($color-pink-basic, 0.35);
}
</style>
