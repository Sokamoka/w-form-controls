<template>
  <div :class="['helper-text-container', { 'is-error': error, 'sr-only': isHelperSrOnly }]" aria-live="assertive">
    <ExclamationIcon v-if="error" class="icon" />
    <InformationCircleIcon v-if="text && !error" class="icon" />
    <div>{{ props.text }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ExclamationIcon, InformationCircleIcon } from '@vue-hero-icons/outline';

const props = defineProps({
  error: {
    type: Boolean,
    deafult: false,
  },

  text: {
    type: String,
    default: '',
  },

  helperSrOnly: {
    type: Boolean,
    deafult: false,
  },
});
const isHelperSrOnly = computed(() => props.helperSrOnly && !props.error);
</script>

<style lang="scss" scoped>
.helper-text-container {
  display: flex;
  padding: 10px 0;
  color: $color-gray-basic;
  text-align: left;

  > div {
    flex-grow: 1;
  }

  .icon {
    flex-basis: 34px;
    stroke: $color-gray-basic;
    width: 22px;
    height: 22px;
  }

  & + .helper-text-container {
    padding-top: 0;
  }

  &.is-error {
    color: $color-pink-basic;

    .icon {
      stroke: $color-pink-basic;
    }
  }
}
</style>
