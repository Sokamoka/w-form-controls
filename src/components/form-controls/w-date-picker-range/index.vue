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
      :start-id="startRefId"
      :end-id="endRefId"
      :click="onClick"
      :focus="state.set"
    />

    <template v-slot:helper>
      <div>
        <slot name="helper">
          <template v-for="{ helperText, helperTextSrOnly, message, name, id } in fields">
            <HelperText
              v-if="message || helperText"
              :key="name"
              :id="id"
              :error="Boolean(message)"
              :text="message ? message : helperText"
              :helper-sr-only="helperTextSrOnly"
            />
          </template>
        </slot>
      </div>
    </template>
    <template v-slot:content>
      <Calendar
        :attributes="attributes"
        :from-page="fromPage"
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
import { formatDate, useDebounceFn, useTimeoutFn } from '@vueuse/core';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import { CalendarIcon } from '@vue-hero-icons/outline';
import useDateRange from '~/composables/use-date-range.js';
import WPopper from '../w-popper/index.vue';
import WInput from '../w-input/index.vue';
import { PLACEMENTS } from '../w-popper/internal';
import HelperText from '../w-input/helper-text.vue';
import { useExpandedFieldProvider, usePopperContentProvider } from '../internal';
import { getMonth, getYear } from 'date-fns';
// import { focusIn, FOCUS_BEHAVIOR } from '../../../utils/focus-management';

export default {
  name: 'DatePickerRange',

  inheritAttrs: false,

  components: { WPopper, WInput, Calendar, CalendarIcon, HelperText },

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

    appendTo: {
      type: String,
      default: 'body',
    },

    valid: {
      type: Boolean,
      default: false,
    },

    error: {
      type: Boolean,
      default: false,
    },

    helperText: {
      type: String,
      default: '',
    },

    helperTextSrOnly: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, { emit }) {
    const popperRef = ref(null);
    const isPopperVisible = ref(false);

    const { state, startDate, endDate, dateRange, normalizedDateRange, startRefId, endRefId, isReady, resetDates } =
      useDateRange({
        initialStartDate: computed(() => props.value?.start),
        initialEndDate: computed(() => props.value?.end),
      });

    const formatedStartDate = computed(() => props.value?.start && formatDate(props.value.start, props.format));
    const formatedEndDate = computed(() => props.value?.end && formatDate(props.value.end, props.format));

    // Minig az aktuális év/honap oldalra ugrik
    const fromPage = computed(() => {
      const year = getYear(props.value?.start);
      const month = getMonth(props.value?.start) + 1;
      return { month, year };
    });

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

    usePopperContentProvider(computed(() => popperRef?.value?.popperRef));

    const { fields } = useExpandedFieldProvider();

    const onDayMouseEnter = (event) => {
      // if (state.isStart()) return;
      // endDate.value = event.date;
    };

    const onChange = (event) => {
      if (state.isStart()) {
        startDate.value = event.date;
        endDate.value = null;
        emit('input', normalizedDateRange());
        // endDate.value = event.date;
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
        event.event.preventDefault();
        onChange(event);
      }
    };

    watch(isPopperVisible, (visible) => {
      if (visible) return;
      resetDates();
    });

    return {
      state,
      fields,
      popperRef,
      startRefId,
      endRefId,
      attributes,
      isPopperVisible,
      formatedStartDate,
      formatedEndDate,
      fromPage,
      onChange,
      onDayKeydown,
      onDayMouseEnter,
      onClick: () => {
        if (isPopperVisible.value) return;
        isPopperVisible.value = true;
      },
      onLeave: (event) => {
        emit('blur', event);
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
