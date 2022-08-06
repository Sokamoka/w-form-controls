<template>
  <WPopper
    as="div"
    ref="popperRef"
    :placement="placement"
    :triggers="['focusWithin']"
    :append-to="appendTo"
    theme="content-within"
    handle-resize
    hide-on-click-outside
    :shown="isPopperVisible"
    @update:shown="onPopperVisibleUpdate"
    @leave="$emit('blur')"
  >
    <WInput
      v-model="inputValue"
      :label="label"
      :help="help"
      :name="name"
      :scope="scope"
      readonly
      @focus="$emit('focus')"
      @click.stop="onClick"
    >
      <template v-slot:append>
        <CalendarIcon class="icon" />
      </template>
    </WInput>
    <template v-slot:content>
      <Calendar
        :attributes="attributes"
        v-bind="$attrs"
        @dayclick="onChange"
        @daykeydown="onDayKeydown"
      />
    </template>
  </WPopper>
</template>

<script>
import { computed, ref } from 'vue';
import { formatDate, unrefElement } from '@vueuse/core';
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
    const isPopperVisible = ref(false);
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

    const onChange = (event) => {
      emit('input', event.date);
      // console.log(unrefElement(popperRef.value?.tooltipRef.triggerRef));
      focusIn(unrefElement(popperRef.value?.tooltipRef.triggerRef), FOCUS_BEHAVIOR.first);
      // close();
      isPopperVisible.value = false;
    };

    const onDayKeydown = (event) => {
      const key = event.event.key;
      if ([' ', 'Enter'].includes(key) && !event.isDisabled) {
        emit('input', event.date);
        focusIn(unrefElement(popperRef.value?.tooltipRef.triggerRef), FOCUS_BEHAVIOR.first);
        // close();
        isPopperVisible.value = false;
      }
    };

    return {
      popperRef,
      inputValue,
      attributes,
      isPopperVisible,
      onChange,
      onDayKeydown,
      onClick: (event) => {
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
