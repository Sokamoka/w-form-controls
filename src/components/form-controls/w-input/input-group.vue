<template>
  <InputGroup v-slot:default="{ errors, hasError }">
    <div :class="['input-group', { 'is-error': hasError }]">
      <slot />
    </div>
    <template v-for="{ helperText, helperTextSrOnly, message, name, id } in errors">
      <HelperText
        v-if="message || helperText"
        :key="id"
        :id="id"
        :error="Boolean(message)"
        :text="message ? message : helperText"
        :helper-sr-only="helperTextSrOnly"
      />
    </template>
  </InputGroup>
</template>
<script>
import { InputGroup } from '../w-input/input';
import HelperText from './helper-text.vue';

export default {
  name: 'WInputGroup',

  components: {
    InputGroup,
    HelperText,
  },
};
</script>

<style lang="scss">
.input-group {
  display: flex;
  border: 1px solid $color-gray-basic;
  border-radius: 5px;
  overflow-x: auto;

  &.is-error {
    border-color: $color-pink-basic;
    box-shadow: 0 0 10px rgba($color-pink-basic, 0.35);
  }
}

.input-group:focus-within {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}

.input-group > div {
  flex: 1;
}

.input-group > div .w-input-wrapper {
  border: none;
  border-right: 1px solid $color-gray-basic;
  border-radius: 0;
}

.input-group > div:first-of-type .w-input-wrapper {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group > div:last-of-type .w-input-wrapper {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-right: none;
}
.input-group .w-input-wrapper:focus-within {
  box-shadow: inset 0 0 0 1px $color-gray-basic;
}

.input-group .w-input-wrapper.is-error:focus-within {
  box-shadow: inset 0 0 0 2px $color-pink-basic, 0 0 10px rgba($color-pink-basic, 0.35);
}

@media (max-width: 640px) {
  .input-group {
    flex-direction: column;
  }

  .input-group > div .w-input-wrapper {
    border: none;
    border-bottom: 1px solid $color-gray-basic;
    border-radius: 0;
  }

  .input-group > div:last-of-type .w-input-wrapper {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-right: none;
    border-bottom: none;
  }
}
</style>
