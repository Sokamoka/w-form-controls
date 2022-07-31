<script setup>
import { ExclamationIcon } from "@vue-hero-icons/outline";

const props = defineProps({
  message: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="error-container">
    <ExclamationIcon class="warning-icon" />
    <div>{{ props.message }}</div>
  </div>
</template>

<style lang="scss" scoped>
.error-container {
  display: flex;
  padding: 10px 0;
  color: $color-pink-basic;

  .warning-icon {
    margin-right: 10px;
    stroke: $color-pink-basic;
  }

  & + .error-container {
    padding-top: 0;
  }
}
</style>
