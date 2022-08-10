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
    @leave="onLeave"
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
      <slot name="helper" :message="validatorFieldErrorMessage" :error="hasError" :valid="isValid">
        <p v-show="hasError">{{ validatorFieldErrorMessage }}</p>
      </slot>
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
import { computed, ref, watch } from 'vue';
import { formatDate } from '@vueuse/core';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import { CalendarIcon } from '@vue-hero-icons/outline';
import useVeeValidator from '~/composables/use-vee-validator.js';
import useDateRange from '~/composables/use-date-range.js';
import WPopper from '../w-popper/index.vue';
import WInput from '../w-input/index.vue';
import { PLACEMENTS } from '../w-popper/internal';
// import { ExternalValidationContext } from '../internal';
// import { focusIn, FOCUS_BEHAVIOR } from '../../../utils/focus-management';

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

    valid: {
      type: Boolean,
      default: false,
    },

    error: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    // const validator = inject('$validator', {});

    const popperRef = ref(null);
    const isPopperVisible = ref(false);

    // const childEvents = [];
    // const api = {
    //   register: (events) => {
    //     childEvents.push(events)
    //   },
    //   emitBlur: (event) => childEvents.forEach((e) => e.blur(event)),
    //   emitInput: () => childEvents.forEach((e) => e.input()),
    // };

    // provide(ExternalValidationContext, api);

    const {
      message: validatorFieldErrorMessage,
      error: hasError,
      valid: isValid,
    } = useVeeValidator({
      name: props.name,
      scope: props.scope,
      error: computed(() => props.error),
      valid: props.valid,
    });

    const { state, startDate, endDate, dateRange, normalizedDateRange, startRefId, endRefId, isReady, resetDates } =
      useDateRange({
        initialStartDate: props.value?.start,
        initialEndDate: props.value?.end,
      });

    const formatedStartDate = computed(() => props.value?.start && formatDate(props.value.start, props.format));
    const formatedEndDate = computed(() => props.value?.end && formatDate(props.value.end, props.format));

    const attributes = computed(() => {
      return [
        {
          highlight: {
            start: { color: 'pink', fillMode: 'outline' },
            base: { color: 'pink', fillMode: 'light' },
            end: { color: 'pink', fillMode: 'outline' },
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
        // api.emitInput();
        if (isReady()) isPopperVisible.value = false;
        endDate.value = event.date;
        state.step();
        return;
      }
      endDate.value = event.date;
      emit('input', normalizedDateRange());
      // api.emitInput();
      const element = document.querySelector(`[data-end-id="${endRefId}"]`);
      element?.focus();
      if (!startDate.value) return state.step();
      isPopperVisible.value = false;
    };

    const onDayKeydown = (event) => {
      const key = event.event.key;
      if ([' ', 'Enter'].includes(key) && !event.isDisabled) {
        event.event.preventDefault();
        onChange(event);
      }
      if (key.includes('Arrow')) {
        onDayMouseEnter(event);
      }
    };

    watch(isPopperVisible, (visible) => {
      if (visible) return;
      startDate.value = props.value?.start;
      endDate.value = props.value?.end;
    });

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
      onLeave: (event) => {
        emit('blur', event);
        // api.emitBlur(event);
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
