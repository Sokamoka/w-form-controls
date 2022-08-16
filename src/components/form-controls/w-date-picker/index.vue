<template>
  <WPopper
    as="div"
    ref="popperRef"
    :placement="placement"
    :triggers="['focusWithin']"
    :append-to="appendTo"
    theme="content-within"
    :shown="isPopperVisible"
    handle-resize
    hide-on-click-outside
    @update:shown="onPopperVisibleUpdate"
  >
    <slot name="default" :value="inputValue" :click="onClick" />

    <template v-slot:helper>
      <div v-if="!helperTextDisabled">
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
      <Calendar :attributes="attributes" v-bind="$attrs" @dayclick="onChange" @daykeydown="onDayKeydown" />
    </template>
  </WPopper>
</template>

<script>
import { computed, ref } from 'vue';
import { formatDate, unrefElement } from '@vueuse/core';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import { useExpandedFieldProvider, usePopperContentProvider } from '../internal';
import { focusIn, FOCUS_BEHAVIOR } from '../../../utils/focus-management';
import { isDate } from 'date-fns';
import { PLACEMENTS } from '../w-popper/internal';
import WPopper from '../w-popper/index.vue';
import HelperText from '../w-input/helper-text.vue';

export default {
  name: 'DatePicker',

  inheritAttrs: false,

  components: { WPopper, Calendar, HelperText },

  props: {
    value: {
      type: [Object, String, Date],
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

    helperText: {
      type: String,
      default: '',
    },

    appendTo: {
      type: String,
      default: '',
    },

    helperTextDisabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const popperRef = ref(null);
    const isPopperVisible = ref(false);
    const inputValue = computed(() => {
      // Todo: input mask miatt kell
      if (!isDate(props.value)) return '';
      return formatDate(props.value, props.format);
    });

    const attributes = computed(() => {
      return [
        {
          highlight: {
            color: 'pink',
            fillMode: 'light',
          },

          dates: props.value,
        },
      ];
    });

    usePopperContentProvider(computed(() => popperRef?.value?.popperRef));

    const { fields } = useExpandedFieldProvider();

    const onChange = (event) => {
      emit('input', event.date);
      focusIn(unrefElement(popperRef.value?.tooltipRef.triggerRef), FOCUS_BEHAVIOR.first);
      isPopperVisible.value = false;
    };

    const onDayKeydown = (event) => {
      const key = event.event.key;
      if ([' ', 'Enter'].includes(key) && !event.isDisabled) {
        event.event.preventDefault();
        emit('input', event.date);
        focusIn(unrefElement(popperRef.value?.tooltipRef.triggerRef), FOCUS_BEHAVIOR.first);
        isPopperVisible.value = false;
      }
    };

    return {
      popperRef,
      inputValue,
      attributes,
      isPopperVisible,
      fields,
      onChange,
      onDayKeydown,
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
