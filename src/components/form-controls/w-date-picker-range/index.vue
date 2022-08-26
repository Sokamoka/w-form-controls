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
      <slot name="header" :state="state" :close="close"></slot>
      <Calendar
        :attributes="attributes"
        :from-page="fromPage"
        :min-date="minDate"
        :max-date="maxDate"
        v-bind="$attrs"
        @dayclick="onChange"
        @daykeydown="onDayKeydown"
        @daymouseenter="onDayMouseEnter"
      />
      <slot name="footer" :state="state" :close="close"></slot>
    </template>
  </WPopper>
</template>

<script>
import { computed, ref } from 'vue';
import { formatDate } from '@vueuse/core';
import { CalendarIcon } from '@vue-hero-icons/outline';
import { PLACEMENTS } from '../w-popper/internal';
import useDateRange from '~/composables/use-date-range.js';
import WPopper from '../w-popper/index.vue';
import WInput from '../w-input/index.vue';
import Calendar from '../calendar.vue';
import HelperText from '../w-input/helper-text.vue';
import { useExpandedFieldProvider, usePopperContentProvider } from '../internal';

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

    minDate: {
      type: Date,
      default: null,
    },

    maxDate: {
      type: Date,
      default: null,
    },
  },

  setup(props, { emit }) {
    const popperRef = ref(null);
    const isPopperVisible = ref(false);

    const close = () => (isPopperVisible.value = false);

    const { state, dateRange, startRefId, endRefId, indicateMouseMove, setState, change, fromPage } = useDateRange({
      initialStartDate: computed(() => props.value?.start),
      initialEndDate: computed(() => props.value?.end),
      closeSelected: false,
      close,
      update: (payload) => emit('input', payload),
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

    usePopperContentProvider({
      contentRef: computed(() => popperRef.value?.popperRef),
    });

    const { fields } = useExpandedFieldProvider();

    const onDayKeydown = (event) => {
      const key = event.event.key;
      if ([' ', 'Enter'].includes(key) && !event.isDisabled) {
        event.event.preventDefault();
        change(event);
      }
    };

    const onClick = () => {
      if (isPopperVisible.value) return;
      isPopperVisible.value = true;
    };

    return {
      fields,
      popperRef,
      attributes,
      isPopperVisible,
      fromPage,
      state,
      close,
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
