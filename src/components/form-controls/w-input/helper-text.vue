<template>
  <div class="error-container">
    <ExclamationIcon class="warning-icon" />
    <InformationCircleIcon class="warning-icon" />
    <div>{{ props.message }}</div>
  </div>
</template>

<script setup>
import { ExclamationIcon, InformationCircleIcon } from '@vue-hero-icons/outline';

const props = defineProps({
  error: {
    type: Boolean,
    deafult: false,
  },

  message: {
    type: String,
    default: '',
  },
});
</script>
