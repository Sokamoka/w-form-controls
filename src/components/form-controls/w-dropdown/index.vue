<template>
  <dropdown v-model="modelValue" v-slot:default="{ open, value }" @open="onUpdateDhown" @close="onUpdateDhown">
    <dropdown-button ref="buttonRef" :as="as">
      <slot :value="value" />
    </dropdown-button>
    <div ref="popperRef" tabindex="-1">
      <transition name="popper-fade">
        <DropdownOptions v-if="open" class="max-w-xs bg-white shadow-lg" static>
          <slot name="options">
            <template v-for="option in options">
              <DropdownOption :key="option.value" as="template" :value="option" v-slot="{ active }">
                <slot name="option" :value="option" :active="active">
                  <li :class="[active ? 'bg-gray-300' : 'bg-gray-200']">{{ option.name }}</li>
                </slot>
              </DropdownOption>
            </template>
          </slot>
        </DropdownOptions>
      </transition>
    </div>
  </dropdown>
</template>

<script>
import { unrefElement } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import usePopper from '../../../composables/use-popper';
import { PLACEMENTS } from '../w-popper/internal';
import { Dropdown, DropdownButton, DropdownOptions, DropdownOption } from './base-dropdown';

export default {
  name: 'WDropdown',

  inheritAttrs: false,

  components: {
    Dropdown,
    DropdownButton,
    DropdownOptions,
    DropdownOption,
  },

  props: {
    as: {
      type: String,
      default: 'div',
    },

    value: {
      type: [Object, String],
      deafult: '',
    },

    options: {
      type: [Object, Array],
      deafult: () => [],
    },

    placement: {
      type: String,
      default: 'top',
      validator: (value) => PLACEMENTS.includes(value),
    },
  },

  setup(props, { emit }) {
    const isOpen = ref(false);
    const buttonRef = ref(null);
    const popperRef = ref(null);

    const modelValue = computed({
      get() {
        return props.value;
      },
      set(value) {
        emit('input', value);
      },
    });

    usePopper({
      isOpen,
      // boundary,
      triggerNode: computed(() => unrefElement(buttonRef.value)),
      popperNode: computed(() => unrefElement(popperRef.value)),
      // offset: props.offset,
      // modifiers: props.modifiers,
      placement: computed(() => props.placement),
      // arrowPadding: props.arrowPadding,
      // overflowPadding: props.overflowPadding,
    });

    onMounted(() => {
      console.log(unrefElement(buttonRef.value));
      console.log(unrefElement(popperRef.value));
    });

    const onUpdateDhown = (value) => {
      isOpen.value = value;
    }

    return {
      isOpen,
      modelValue,
      buttonRef,
      popperRef,
      onUpdateDhown,
    };
  },
};
</script>
