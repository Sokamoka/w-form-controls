<template>
  <InputControl class="w-input-control" v-slot:default="{ id }">
    <InputWrapper
      v-model="modelValue"
      :class="[
        'w-input-wrapper',
        {
          'is-group': isInGroup,
          'is-disabled': disabled,
          'is-error': hasError,
        },
      ]"
      :disabled="disabled"
      :readonly="readonly"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
      <slot name="prepend" />

      <div class="w-input-container">
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
    <!-- <ErrorIndicator
      v-if="hasError && !isInGroup && !errorMessageDisabled"
      :id="`${id}-error`"
      aria-live="assertive"
      :message="currentErrorMessage"
    />
    <p v-if="helperText" :id="`${id}-help`" :class="{ 'sr-only': helperTextSrOnly }">{{ helperText }}</p> -->
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
import { computed, ref } from 'vue';
import { CheckIcon } from '@vue-hero-icons/outline';
import { InputControl, InputWrapper, InputInput, InputLabel, useInputGroup } from './input';
import useVeeValidator from '~/composables/use-vee-validator.js';
import ErrorIndicator from '../../error-indicator.vue';
import HelperText from './helper-text.vue';
// import { useExternalValidation } from '../internal';

export default {
  name: 'W-Input',

  inheritAttrs: false,

  components: {
    CheckIcon,
    InputLabel,
    InputInput,
    InputWrapper,
    InputControl,
    ErrorIndicator,
    HelperText,
  },

  props: {
    value: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      default: 'text',
    },

    label: {
      type: String,
      default: '',
    },

    placeholder: {
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
  },

  setup(props, { emit }) {
    const inputRef = ref(null);

    const currentPlaceholder = computed(() => (props.placeholder ? props.placeholder : props.label));

    const modelValue = computed({
      get() {
        return props.value;
      },
      set(value) {
        emit('input', value);
      },
    });

    // const ariaDescribedby = computed(() => {});

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

    const { isInGroup } = useInputGroup({
      name: props.name,
      message: currentErrorMessage,
      inputId: computed(() => `${inputRef.value?.id}-help`),
    });

    const isHelperVisible = computed(() => {
      if (isInGroup) return false;
      if (hasError) return true;
      if (props.helperTextDisabled) return false;
      return false;
    });
    // const { hasExternalValidation } = useExternalValidation({
    //   blur: (event) => emit('blur', event),
    //   input: () => {
    //     emit('input', modelValue);
    //   },
    // });

    // const onBlur = (event) => {
    //   if (hasExternalValidation) return;
    //   emit('blur', event);
    // };

    return {
      inputRef,
      modelValue,
      currentPlaceholder,
      isInGroup,
      hasError,
      isValid,
      validatorFieldErrorMessage,
      currentErrorMessage,
      isHelperVisible,
      onBlur: (e) => console.log('blur:', e),
      onFocusOut: () => console.log('focusout'),
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

.w-input-wrapper.is-group:focus-within {
  box-shadow: inset 0 0 0 1px #999;
}

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
