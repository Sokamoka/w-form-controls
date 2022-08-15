<template>
  <InputGroup v-slot:default="{ errors }">
    <div class="input-group">
      <slot />
    </div>
    <template v-for="{ message, name, id } in errors">
      <ErrorIndicator v-if="message" :id="id" :key="name" :message="message" aria-live="assertive" />
    </template>
  </InputGroup>
</template>
<script>
import { InputGroup } from '../w-input/input';
import ErrorIndicator from '../../error-indicator.vue';

export default {
  name: 'BaseInputGroup',

  components: {
    InputGroup,
    ErrorIndicator,
  },
};
</script>

<style lang="scss">
.input-group {
  display: flex;
  border: 1px solid $color-gray-basic;
  border-radius: 5px;
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
</style>
