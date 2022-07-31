<template>
  <InputGroup v-slot:default="{ errors }">
    <div class="input-group">
      <slot />
    </div>
    <template v-for="{ message, name } in errors">
      <ErrorIndicator v-if="message" :key="name" :message="message" />
    </template>
  </InputGroup>
</template>
<script>
import { InputGroup } from "../w-input/input";
import ErrorIndicator from "../../error-indicator.vue";

export default {
  name: "BaseInputGroup",

  components: {
    InputGroup,
    ErrorIndicator,
  },
};
</script>

<style>
.input-group {
  display: flex;
  border: 1px solid #999;
  border-radius: 5px;
}

.input-group:focus-within {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}

.input-group > div .w-input-wrapper {
  border: none;
  border-right: 1px solid #999;
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
</style>
