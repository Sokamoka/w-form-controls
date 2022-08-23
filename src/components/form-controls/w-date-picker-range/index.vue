<template>
  <WPopper
    as="div"
    ref="popperRef"
    :placement="placement"
    :triggers="['focusWithin']"
    :append-to="appendTo"
    :shown="isPopperVisible"
    :arrow-padding="arrowPadding"
    :offset="offset"
    theme="content-within"
    handle-resize
    hide-on-click-outside
    @update:shown="onPopperVisibleUpdate"
  >
    <slot name="default" :start-props="startProps" :end-props="endProps" :input-events="inputEvents" />

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
import { formatDate } from '@vueuse/core';
import { CalendarIcon } from '@vue-hero-icons/outline';
import { PLACEMENTS } from '../w-popper/internal';
import useDateRange from '~/composables/use-date-range.js';
import WPopper from '../w-popper/index.vue';
import WInput from '../w-input/index.vue';
import Calendar from '../calendar.vue';
import HelperText from '../w-input/helper-text.vue';
import { useExpandedFieldProvider, usePopperContentProvider } from '../internal';
import { getMonth, getYear } from 'date-fns';

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

    arrowPadding: {
      type: [Number, Object],
      default: 10,
    },

    offset: {
      type: Array,
      default: () => [0, 10],
    },
  },

  setup(props, { emit }) {
    const popperRef = ref(null);
    const isPopperVisible = ref(false);

    const {
      dateRange,
      startRefId,
      endRefId,
      indicateMouseMove,
      setState,
      change,
      stop: stopCloseTimer,
    } = useDateRange({
      initialStartDate: computed(() => props.value?.start),
      initialEndDate: computed(() => props.value?.end),
      emit,
      close: () => (isPopperVisible.value = false),
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

    usePopperContentProvider({
      triggerRef: popperRef.value?.tooltipRef?.triggerRef,
      contentRef: computed(() => popperRef.value?.popperRef),
    });

    const { fields } = useExpandedFieldProvider();

    const onDayKeydown = (event) => {
      const key = event.event.key;
      if ([' ', 'Enter'].includes(key) && !event.isDisabled) {
        event.event.preventDefault();
        change(event);
      }
      if (key.includes('Arrow')) {
        stopCloseTimer();
      }
    };

    const onClick = () => {
      if (isPopperVisible.value) return;
      isPopperVisible.value = true;
    };

    watch(isPopperVisible, (visible) => {
      if (visible) return;
      stopCloseTimer();
    });

    return {
      fields,
      popperRef,
      attributes,
      isPopperVisible,
      fromPage,
      startProps: computed(() => ({
        ['data-start-id']: startRefId,
        value: formatedStartDate.value,
      })),
      endProps: computed(() => ({
        ['data-end-id']: endRefId,
        value: formatedEndDate.value,
      })),
      inputEvents: {
        click: onClick,
        focus: setState,
      },
      onChange: change,
      onDayMouseEnter: indicateMouseMove,
      onDayKeydown,
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
