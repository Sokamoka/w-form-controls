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
    @leave="$emit('blur', $event)"
  >
    <slot name="default" :value="inputValue" :click="onClick" :error="hasError" :valid="isValid" />

    <template v-slot:helper>
      <slot name="helper" :message="validatorFieldErrorMessage" :error="hasError" :valid="isValid">
        <HelperText
          :id="`${name}-help`"
          :error="error"
          :text="error ? errorMessage : helperText"
          :helper-sr-only="helperTextSrOnly"
        />
      </slot>
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
import useVeeValidator from '~/composables/use-vee-validator.js';
import { useExternalPopperProvider } from '../internal';
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

    helperTextSrOnly: {
      type: Boolean,
      default: false,
    },

    error: {
      type: Boolean,
      default: false,
    },

    errorMessage: {
      type: String,
      default: '',
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

    const {
      message: validatorFieldErrorMessage,
      error: hasError,
      valid: isValid,
    } = useVeeValidator({
      name: props.name,
      scope: props.scope,
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

    const { inputEvent } = useExternalPopperProvider({
      value: props.value,
      contentRef: computed(() => popperRef?.value?.popperRef),
    });

    const onChange = (event) => {
      emit('input', event.date);
      focusIn(unrefElement(popperRef.value?.tooltipRef.triggerRef), FOCUS_BEHAVIOR.first);
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
      popperRef,
      inputValue,
      attributes,
      isPopperVisible,
      validatorFieldErrorMessage,
      hasError,
      isValid,
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
