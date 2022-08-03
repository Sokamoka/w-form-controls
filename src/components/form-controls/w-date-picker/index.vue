<template>
  <WPopper
    ref="popperRef"
    :placement="placement"
    :show-triggers="['focusWithin']"
    :hide-triggers="[]"
    :append-to="appendTo"
    theme="content-within"
    hide-on-click-outside
    handle-resize
  >
    <WInput
      v-model="inputValue"
      :label="label"
      :help="help"
      :name="name"
      :scope="scope"
      readonly
      @focus="$emit('focus')"
      @blur="onBlur"
    >
      <template v-slot:append>
        <CalendarIcon class="icon" />
      </template>
    </WInput>
    <template v-slot:content="{ close }">
      <Calendar
        :attributes="attributes"
        v-bind="$attrs"
        @dayclick="(event) => onChange(event, close)"
        @daykeydown="(event) => onDayKeydown(event, close)"
      />
    </template>
  </WPopper>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { formatDate, unrefElement, useEventListener } from '@vueuse/core';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import { CalendarIcon } from '@vue-hero-icons/outline';
import WPopper from '../w-popper/index.vue';
import WInput from '../w-input/index.vue';
import { PLACEMENTS } from '../w-popper/internal';
import { focusIn, FOCUS_BEHAVIOR } from '../../../utils/focus-management';

export default {
  name: 'DatePicker',

  inheritAttrs: false,

  components: { WPopper, WInput, Calendar, CalendarIcon },

  props: {
    value: {
      type: [Object, Array, Date],
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
    const popperRef = ref(null);
    const inputValue = computed(() => props.value && formatDate(props.value, props.format));

    const attributes = computed(() => {
      return [
        {
          highlight: {
            color: 'pink',
            fillMode: 'light',
            base: { fillMode: 'light' },
          },

          dates: props.value,
          // dates: { start: new Date(2022, 7, 14), end: new Date(2022, 7, 18) },
        },
      ];
    });

    const onChange = (event, close) => {
      emit('input', event.date);
      console.log(unrefElement(popperRef.value?.tooltipRef.triggerRef));
      focusIn(unrefElement(popperRef.value?.tooltipRef.triggerRef), FOCUS_BEHAVIOR.first);
      // close();
    };

    const onDayKeydown = (event, close) => {
      const key = event.event.key;
      if ([' ', 'Enter'].includes(key) && !event.isDisabled) {
        emit('input', event.date);
        focusIn(unrefElement(popperRef.value?.tooltipRef.triggerRef), FOCUS_BEHAVIOR.first);
        close();
      }
    };

    const onBlur = (event) => {
      // console.log(unrefElement(popperRef.value?.popperRef), document.activeElement);
      if (unrefElement(popperRef.value?.popperRef).contains(event.relatedTarget)) return;
      emit('blur');
    };

    useEventListener(unrefElement(popperRef), 'keydown', (event) => {
      console.log(event);
    });

    onMounted(() => {
      console.log(popperRef.value);
    });

    return {
      popperRef,
      inputValue,
      attributes,
      onChange,
      onBlur,
      onDayKeydown,
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
