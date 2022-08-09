<template>
  <WPopper
    as="div"
    ref="popperRef"
    :placement="placement"
    :show-triggers="['focusWithin']"
    :hide-triggers="[]"
    :append-to="appendTo"
    theme="content-within"
    :shown="isPopperVisible"
    handle-resize
    hide-on-click-outside
    @update:shown="onPopperVisibleUpdate"
    @leave="$emit('blur')"
  >
    <slot
      name="default"
      :start-date="formatedStartDate"
      :end-date="formatedEndDate"
      :error="hasError"
      :valid="isValid"
      :start-id="startRefId"
      :end-id="endRefId"
      :click="onClick"
      :focus="state.set"
    />

    <template v-slot:helper>
      <slot name="helper" :message="validatorFieldErrorMessage" :error="hasError" :valid="isValid" />
    </template>
    <template v-slot:content>
      <Calendar
        :attributes="attributes"
        v-bind="$attrs"
        @dayclick="onChange"
        @daykeydown="onDayKeydown"
        @daymouseenter="onDayMouseEnter"
      />
    </template>
  </WPopper>
</template>

<script>
import { computed, inject, ref } from 'vue';
import { formatDate, unrefElement } from '@vueuse/core';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import { CalendarIcon } from '@vue-hero-icons/outline';
import useVeeValidator from '~/composables/use-vee-validator.js';
import useDateRange from '~/composables/use-date-range.js';
import WPopper from '../w-popper/index.vue';
import WInput from '../w-input/index.vue';
import { PLACEMENTS } from '../w-popper/internal';
import { focusIn, FOCUS_BEHAVIOR } from '../../../utils/focus-management';

export default {
  name: 'DatePickerRange',

  inheritAttrs: false,

  components: { WPopper, WInput, Calendar, CalendarIcon },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },

    name: {
      type: String,
      default: '',
    },

    scope: {
      type: String,
      default: '',
    },

    label: {
      type: String,
      default: '',
    },

    placement: {
      type: String,
      default: 'top',
      validator: (value) => PLACEMENTS.includes(value),
    },

    format: {
      type: String,
      default: 'MM/DD/YYYY',
    },

    help: {
      type: String,
      default: '',
    },

    appendTo: {
      type: String,
      default: '',
    },
  },

  setup(props, { emit }) {
    const validator = inject('$validator', {});

    const popperRef = ref(null);
    const isPopperVisible = ref(false);

    const { validatorFieldErrorMessage, hasError, isValid } = useVeeValidator(validator, props);

    const { state, startDate, endDate, dateRange, normalizedDateRange, startRefId, endRefId, isReady } = useDateRange({
      initialStartDate: props.value?.start,
      initialEndDate: props.value?.end,
    });

    const formatedStartDate = computed(() => props.value?.start && formatDate(props.value.start, props.format));
    const formatedEndDate = computed(() => props.value?.end && formatDate(props.value.end, props.format));

    const attributes = computed(() => {
      return [
        {
          highlight: {
            color: 'pink',
            fillMode: 'light',
            base: { fillMode: 'light' },
          },

          dates: dateRange.value,
        },
      ];
    });

    const onDayMouseEnter = (event) => {
      if (state.isStart()) return (startDate.value = event.date);
      endDate.value = event.date;
    };

    const onChange = (event) => {
      if (state.isStart()) {
        startDate.value = event.date;
        endDate.value = null;
        emit('input', normalizedDateRange());
        if (isReady()) isPopperVisible.value = false;
        state.step();
        return;
      }
      endDate.value = event.date;
      emit('input', normalizedDateRange());
      const element = document.querySelector(`[data-end-id="${endRefId}"]`);
      element?.focus();
      if (!startDate.value) return state.step();
      isPopperVisible.value = false;
    };

    const onDayKeydown = (event) => {
      const key = event.event.key;
      if ([' ', 'Enter'].includes(key) && !event.isDisabled) {
        emit('input', event.date);
        focusIn(unrefElement(popperRef.value?.tooltipRef.triggerRef), FOCUS_BEHAVIOR.first);
        isPopperVisible.value = false;
      }
    };

    return {
      state,
      popperRef,
      startRefId,
      endRefId,
      attributes,
      isPopperVisible,
      validatorFieldErrorMessage,
      hasError,
      isValid,
      formatedStartDate,
      formatedEndDate,
      onChange,
      onDayKeydown,
      onDayMouseEnter,
      onClick: () => {
        if (isPopperVisible.value) return;
        isPopperVisible.value = true;
      },
      onPopperVisibleUpdate: (value) => (isPopperVisible.value = value),
    };
  },
};
</script>

<style lang="scss" scoped>
.icon {
  display: block;
  margin: 0 15px;
  stroke: $color-gray-basic;
  pointer-events: none;
}

.vc-container {
  border-color: transparent;
}
</style>
