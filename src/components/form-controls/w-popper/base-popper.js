import {
  ref,
  inject,
  provide,
  computed,
  defineComponent,
  watchEffect,
} from "vue";
import { useDebounceFn, useEventListener, unrefElement } from "@vueuse/core";
import { omit } from "ramda";
import { render } from "~/utils/vnode/render";
import { useId } from "~/composables/use-id";
import { HIDE_EVENT_MAP, SHOW_EVENT_MAP, useTriggerEvents } from "./internal";

const PopoverContext = Symbol("PopoverContext");

const usePopoverContext = (component) => {
  const context = inject(PopoverContext, null);

  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <Popover /> component.`
    );
    if (Error.captureStackTrace)
      Error.captureStackTrace(err, usePopoverContext);
    throw err;
  }

  return context;
};

export const Popover = defineComponent({
  name: "Poppper",

  props: {
    as: {
      type: [Object, String],
      default: "div",
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    shown: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const triggerId = `popper-trigger-${useId()}`;
    const panelId = `popper-panel-${useId()}`;

    const isOpen = ref(false);
    const triggerRef = ref(null);
    const panelRef = ref(null);

    const isDisabled = computed(() => props.disabled);

    const api = {
      isOpen,
      triggerId,
      panelId,
      triggerRef,
      panelRef,
      togglePopover: () => {
        if (isDisabled.value) return;
        isOpen.value = !isOpen.value;
        emit("update:shown", isOpen.value);
      },

      open: () => {
        if (isDisabled.value) return;
        if (isOpen.value) return;
        isOpen.value = true;
        emit("update:shown", true);
      },

      close: () => {
        if (isDisabled.value) return;
        if (!isOpen.value) return;
        isOpen.value = false;
        emit("update:shown", false);
      },
    };

    provide(PopoverContext, api);

    watchEffect(() => {
      if (isDisabled.value) return (isOpen.value = false);
      isOpen.value = props.shown;
    });

    return {
      isOpen,
      triggerRef,
    };
  },

  render() {
    const data = omit(["disabled", "shown"], this.$props);
    const slots = this.$scopedSlots;
    const slot = {
      open: this.isOpen,
    };
    return render({
      data: { ...data, ...this.$attrs },
      slot,
      slots,
      name: "Popover",
    });
  },
});

export const PopoverButton = defineComponent({
  name: "PopoverButton",

  props: {
    as: {
      type: [Object, String],
      default: "button",
    },

    triggers: {
      type: Array,
      default: () => ["click"],
    },

    showTriggers: {
      type: [Array, Function],
      default: null,
    },

    hideTriggers: {
      type: [Array, Function],
      default: null,
    },

    openDelay: {
      type: Number,
      default: 0,
    },

    closeDelay: {
      type: Number,
      default: 0,
    },
  },

  setup(props) {
    const api = usePopoverContext("PopoverButton");

    return {
      el: api.triggerRef,
      onClick: () => {
        api.togglePopover();
      },

      onEnter: useDebounceFn(() => api.open(), props.openDelay),

      onLeave: useDebounceFn(() => api.close(), props.closeDelay),

      onKeyDown(event) {
        switch (event.key) {
          case "Escape":
            if (!api.isOpen) return;
            if (!unrefElement(api.triggerRef)) return;
            if (!unrefElement(api.triggerRef)?.contains(document.activeElement))
              return;
            event.preventDefault();
            event.stopPropagation();
            api.close();
            break;

          default:
            break;
        }
      },
    };
  },

  render() {
    const api = usePopoverContext("PopoverButton");
    const slots = this.$scopedSlots;

    const showTriggerEvents = useTriggerEvents(
      SHOW_EVENT_MAP,
      this.triggers,
      this.showTriggers,
      this.onEnter,
      this.onClick
    );

    const hideTriggerEvents = useTriggerEvents(
      HIDE_EVENT_MAP,
      this.triggers,
      this.hideTriggers,
      this.onLeave,
      this.onClick
    );

    const propsWeControl = {
      ref: "el",
      attrs: {
        id: api.triggerId,
        "aria-describedby": api.panelId,
        disabled: this.$props.disabled ? true : undefined,
      },

      on: {
        keydown: this.onKeyDown,
        ...showTriggerEvents,
        ...hideTriggerEvents,
      },
    };

    return render({
      data: { as: this.$props.as, ...propsWeControl, ...this.$attrs },
      slots,
      name: "PopoverButton",
    });
  },
});

export const PopoverPanel = defineComponent({
  name: "PopoverPanel",

  props: {
    as: {
      type: [Object, String],
      default: "div",
    },

    static: {
      type: Boolean,
      default: false,
    },

    unmount: {
      type: Boolean,
      default: true,
    },

    hideOnClickOutside: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const api = usePopoverContext("PopoverPanel");

    if (props.hideOnClickOutside) {
      useEventListener(window, "mousedown", (event) => {
        if (!api.isOpen.value) return;
        const target = event.target;

        if (unrefElement(api.triggerRef)?.contains(target)) return;
        if (unrefElement(api.panelRef)?.contains(target)) return;

        api.close();
      });
    }

    return {
      el: api.panelRef,
      visible: api.isOpen,
      onKeyDown(event) {
        switch (event.key) {
          case "Escape":
            if (!api.isOpen) return;
            if (!unrefElement(api.panelRef)) return;
            if (!unrefElement(api.panelRef)?.contains(document.activeElement))
              return;
            event.preventDefault();
            event.stopPropagation();
            api.close();
            unrefElement(api.buttonRef)?.focus();
            break;
          default:
            break;
        }
      },
    };
  },

  render() {
    const api = usePopoverContext("PopoverPanel");

    const propsWeControl = {
      ref: "el",
      attrs: {
        id: api.panelId,
      },

      on: {
        keydown: this.onKeyDown,
      },
    };
    const slots = this.$scopedSlots;

    const slot = { close: api.close };

    return render({
      slot,
      data: { ...this.$props, ...propsWeControl },
      slots,
      visible: this.visible,
      strategy: "unmount",
      name: "PopoverPanel",
    });
  },
});
