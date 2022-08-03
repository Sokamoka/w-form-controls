<template>
  <popover
    ref="tooltipRef"
    v-slot:default="{ open }"
    :disabled="disabled"
    :shown="shown"
    @update:shown="onChangeVisbility"
  >
    <popover-button
      :as="as"
      :triggers="triggers"
      :show-triggers="showTriggers"
      :hide-triggers="hideTriggers"
      :open-delay="openDelay"
      :close-delay="closeDelay"
    >
      <slot />
    </popover-button>
    <div ref="popperRef" class="w-popper__popper">
      <transition :name="transition">
        <popover-panel
          v-if="open"
          v-slot:default="{ close }"
          :class="theme"
          :hide-on-click-outside="hideOnClickOutside"
          role="tooltip"
          static
        >
          <slot name="content" :close="close">{{ content }}</slot>
          <popper-arrow v-if="arrow" />
        </popover-panel>
      </transition>
    </div>
  </popover>
</template>

<script>
import { ref, unref, computed, onMounted, onUnmounted } from 'vue';
import { useResizeObserver, unrefElement } from '@vueuse/core';
import usePopper from '~/composables/use-popper.js';
import { appendTo } from '~/utils/dom.js';
import PopperArrow from './w-popper-arrow.vue';
import { Popover, PopoverButton, PopoverPanel } from './base-popper.js';
import { PLACEMENTS } from './internal.js';

export default {
  name: 'WPopper',

  components: {
    Popover,
    PopperArrow,
    PopoverPanel,
    PopoverButton,
  },

  props: {
    /**
     * The element or component the W-Popper should render as
     */
    as: {
      type: [Object, String],
      default: 'template',
    },

    /**
     * Disables the Popper. If it was already open, it will be closed
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Preferred placement (the "auto" placements will choose the side with most space.)
     */
    placement: {
      type: String,
      default: 'top',
      validator: (value) => PLACEMENTS.includes(value),
    },

    /**
     * Content, if we do not use a content slot
     */
    content: {
      type: String,
      default: '',
    },

    /**
     * The popper theme applied to the popper
     */
    theme: {
      type: String,
      default: 'default-tooltip',
    },

    /**
     * Default position offset [skidding, distance] (px)
     * https://popper.js.org/docs/v2/modifiers/offset/
     */
    offset: {
      type: Array,
      default: () => [0, 10],
    },

    /**
     * Display an arrow on the popper
     */
    arrow: {
      type: Boolean,
      default: true,
    },

    /**
     * Stop arrow from reaching the edge of the popper
     */
    arrowPadding: {
      type: [Number, Object],
      default: 3,
    },

    /**
     * Virtual padding in the boundary used to prevent the popper overflow
     */
    overflowPadding: {
      type: [Number, Object],
      default: 0,
    },

    /**
     * Append popper to specified target
     */
    appendTo: {
      type: String,
      default: '',
    },

    /**
     * Different triggers for the showing or hiding action of the popper
     */
    triggers: {
      type: Array,
      default: () => ['hover', 'focus'],
    },

    /**
     * Override the trigger events for showing
     */
    showTriggers: {
      type: [Array, Function],
      default: null,
    },

    /**
     * Override the trigger events for hiding
     */
    hideTriggers: {
      type: [Array, Function],
      default: null,
    },

    /**
     * Boolean that shows or hide the popper
     */
    shown: {
      type: Boolean,
      default: false,
    },

    /**
     * Hide popper when click outside
     */
    hideOnClickOutside: {
      type: Boolean,
      default: false,
    },

    /**
     * Element used to compute position and size boundaries
     */
    boundary: {
      type: HTMLElement,
      default: undefined,
    },

    /**
     * Popper.js modifiers
     * https://popper.js.org/docs/v2/modifiers/
     */
    modifiers: {
      type: Array,
      default: () => [],
    },

    /**
     * Popper transition
     */
    transition: {
      type: String,
      default: 'popper-fade',
    },

    /**
     * Open the Popper after a delay (ms).
     */
    openDelay: {
      type: Number,
      default: 0,
    },

    /**
     * Close the Popper after a delay (ms).
     */
    closeDelay: {
      type: Number,
      default: 0,
    },

    /**
     * Update popper on content resize
     */
    handleResize: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const tooltipRef = ref(null);
    const popperRef = ref(null);

    const isOpen = computed(() => tooltipRef?.value?.isOpen ?? false);
    const triggerRef = computed(() => tooltipRef?.value?.triggerRef ?? null);
    const triggerNode = computed(() => unrefElement(triggerRef));
    const popperNode = computed(() => unrefElement(popperRef));

    const popperPlacement = computed(() => props.placement);

    const onChangeVisbility = (value) => {
      emit('update:shown', value);
    };

    const boundary = computed(() => props.boundary);

    const { update } = usePopper({
      isOpen,
      boundary,
      popperNode,
      triggerNode,
      offset: props.offset,
      modifiers: props.modifiers,
      placement: popperPlacement,
      arrowPadding: props.arrowPadding,
      overflowPadding: props.overflowPadding,
    });

    if (props.handleResize) {
      useResizeObserver(popperNode, () => update());
    }

    onMounted(() => {
      if (!props.appendTo) return;
      appendTo(unref(popperNode), props.appendTo);
    });

    onUnmounted(() => {
      if (props.appendTo) unref(popperNode)?.remove();
    });

    return {
      isOpen,
      popperRef,
      tooltipRef,
      popperPlacement,
      onChangeVisbility,
    };
  },
};
</script>

<style src="./themes/default-tooltip.scss" lang="scss"></style>
<style src="./themes/content-within.scss" lang="scss"></style>

<style lang="scss">
.w-popper__popper {
  z-index: 1;
}

.popper-fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s ease;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
