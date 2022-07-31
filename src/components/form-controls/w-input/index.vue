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
      @focus="$emit('focus')"
      @blur="$emit('blur', $event)"
    >
      <InputInput
        ref="inputRef"
        :type="type"
        :name="name"
        :placeholder="currentPlaceholder"
        :aria-describedby="error ? `${id}-error` : `${id}-help`"
        :aria-invalid="error ? true : null"
        v-bind="$attrs"
        v-on="$listeners"
      />
      <InputLabel>{{ label }}</InputLabel>
      <CheckIcon v-if="isValid" class="valid-icon" />
      <slot name="append" />
    </InputWrapper>
    <ErrorIndicator
      v-if="hasError && !isInGroup"
      :id="`${id}-error`"
      class="error-message"
      aria-live="assertive"
      :message="currentErrorMessage"
    />
    <p v-if="help" :id="`${id}-help`" class="sr-only">{{ help }}</p>
  </InputControl>
</template>

<script>
import { computed, inject, onUnmounted, ref } from "vue";
import { pick } from "ramda";
import { CheckIcon } from "@vue-hero-icons/outline";
import {
  InputControl,
  InputWrapper,
  InputInput,
  InputLabel,
  useInputGroup,
} from "./input";
import ErrorIndicator from "../../error-indicator.vue";

export default {
  name: "W-Input",

  inheritAttrs: false,

  components: {
    CheckIcon,
    InputLabel,
    InputInput,
    InputWrapper,
    InputControl,
    ErrorIndicator,
  },

  props: {
    value: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "text",
    },

    label: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
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
      default: "",
    },

    help: {
      type: String,
      default: "",
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
      default: "",
    },
  },

  setup(props, { emit }) {
    const inputRef = ref(null);
    const isInGroup = ref(false);
    const groupApi = useInputGroup();
    const currentPlaceholder = computed(() =>
      props.placeholder ? props.placeholder : props.label
    );

    const validator = inject("$validator", {});

    const modelValue = computed({
      get() {
        return props.value;
      },
      set(value) {
        emit("input", value);
      },
    });

    const validatorFieldFlags = computed(() => {
      const field = validator.fields.find({
        name: props.name,
        ...(props.scope && { scope: props.nam }),
      });
      return pick(
        ["touched", "dirty", "valid", "pending", "validated"],
        field?.flags ?? {}
      );
    });

    const validatorFieldErrorMessage = computed(() => {
      if (props.scope) return validator.errors.first(props.name, props.scope);
      return validator.errors.first(props.name);
    });

    const hasError = computed(() => {
      const { valid, validated, touched } = validatorFieldFlags.value;
      const fromValidator = !valid && validated && touched;
      return props.error || fromValidator;
    });

    const isValid = computed(() => {
      const { valid } = validatorFieldFlags.value;
      return props.valid || valid;
    });

    const currentErrorMessage = computed(() => {
      if (hasError.value && props.errorMessage) return props.errorMessage;
      return validatorFieldErrorMessage.value;
    });

    if (groupApi) {
      isInGroup.value = true;
      const payload = {
        name: props.name,
        message: currentErrorMessage,
      };
      if (props.name) groupApi.register(payload);
      onUnmounted(() => groupApi.unregister(props.name));
    }

    return {
      inputRef,
      modelValue,
      currentPlaceholder,
      isInGroup,
      hasError,
      isValid,
      validatorFieldErrorMessage,
      validator,
      currentErrorMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
.w-input-control {
  flex: 1;

  .error-message {
    text-align: left;
    color: $color-pink-basic;
  }
}

.w-input-wrapper {
  display: flex;
  position: relative;
  flex-direction: row;
  width: 100%;
  align-items: center;
  border: 1px solid #999;
  border-radius: 5px;
  box-sizing: border-box;
  transition: padding 0.2s ease-in-out, box-shadow 0.2s ease-in-out,
    border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.w-input-wrapper input {
  flex: 1;
  padding: 20px;
  width: 100%;
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
  box-shadow: inset 0 0 0 1px $color-pink-basic,
    0 0 10px rgba($color-pink-basic, 0.35);
}
</style>
