import { onClickOutside, unrefElement, useEventListener } from '@vueuse/core';
import { defineComponent, inject, nextTick, provide, ref, watchEffect } from 'vue';
import { focusIn, FOCUS_BEHAVIOR, isFocusableElement } from '../../../utils/focus-management';
import { render } from '../../../utils/vnode/render';

const DialogContext = Symbol('DialogContext');

function useDialogContext(component) {
  const context = inject(DialogContext, null);
  if (context === null) {
    const err = new Error(`<${component} /> is missing a parent <Dialog /> component.`);
    if (Error.captureStackTrace) Error.captureStackTrace(err, useDialogContext);
    throw err;
  }
  return context;
}

export const Dialog = defineComponent({
  name: 'Dialog',

  inheritAttrs: false,

  props: {
    as: {
      type: String,
      default: 'div',
    },

    open: {
      type: Boolean,
      default: false,
    },

    initialFocus: {
      type: HTMLElement,
      default: null,
    },

    innerFocus: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const isOpen = ref(props.open);

    const buttonRef = ref(null);
    const panelRef = ref(null);

    const api = {
      buttonRef,
      panelRef,
      isOpen,
      open: () => {
        isOpen.value = true;
        emit('open');
        nextTick(() => handleInitialFocus(panelRef, props.innerFocus, props.initialFocus));
      },
      close: () => {
        isOpen.value = false;
        emit('close');
        emit('update:open', false);
        handleElementFocus(buttonRef);
      },
    };

    provide(DialogContext, api);

    useEventListener(document, 'keydown', (event) => {
      if (event.defaultPrevented) return;
      if (event.key !== 'Escape') return;
      if (!isOpen.value) return;
      event.preventDefault();
      event.stopPropagation();
      api.close();
    });

    watchEffect((onInvalidate) => {
      if (!isOpen.value) return;

      document.body.style.overflow = 'hidden';

      onInvalidate(() => {
        document.body.style.overflow = 'visible';
      });
    });

    return {
      isOpen,
      close: api.close,
    };
  },

  render() {
    const slot = {
      open: this.isOpen,
      close: this.close,
    };

    const slots = this.$scopedSlots;

    const data = {
      as: this.$props.as,
    };

    return render({ data, slots, slot, name: 'Dialog' });
  },
});

export const DialogButton = defineComponent({
  name: 'DialogButton',

  props: {
    as: {
      type: String,
      default: 'template',
    },
  },

  setup() {
    const api = useDialogContext('DialogButton');

    const onKeydown = (event) => {
      if ([' ', 'Enter'].includes(event.key)) {
        event.preventDefault();
        api.open();
      }
    };

    return {
      onKeydown,
    };
  },

  render() {
    const api = useDialogContext('DialogButton');

    const slot = {
      open: api.isOpen,
    };
    const slots = this.$scopedSlots;
    const data = {
      as: this.$props.as,
      ref: api.buttonRef,
      on: {
        click: api.open,
        keydown: this.onKeydown,
        ...this.$listeners,
      },
    };

    return render({ data, slots, slot, name: 'DialogButton' });
  },
});

export const DialogPanel = defineComponent({
  name: 'DialogPanel',

  props: {
    as: {
      type: String,
      default: 'div',
    },

    static: {
      type: Boolean,
      default: false,
    },

    unmount: {
      type: Boolean,
      default: true,
    },
  },

  setup() {
    const api = useDialogContext('DialogPanel');

    onClickOutside(api.panelRef, () => api.close());

    return {
      visible: api.isOpen,
    };
  },

  render() {
    const api = useDialogContext('DialogPanel');

    const slot = {
      close: api.close,
    };

    const slots = this.$scopedSlots;
    const data = {
      as: this.$props.as,
      ref: api.panelRef,
    };

    const strategy = this.$props.static ? 'static' : this.$props.unmount ? 'unmount' : 'hidden';

    return render({ data, slot, slots, visible: this.visible, strategy, name: 'DialogPanel' });
  },
});

const handleElementFocus = (element) => {
  element = unrefElement(element);
  if (isFocusableElement(element)) return element?.focus(); // Ha pl. button
  focusIn(element, FOCUS_BEHAVIOR.first); // Pl. input komponens
};

const handleInitialFocus = (element, innerFocus, initialFocusElement) => {
  nextTick(() => {
    if (initialFocusElement) return unrefElement(initialFocusElement)?.focus();
    if (innerFocus) focusIn(unrefElement(element), FOCUS_BEHAVIOR.first);
  });
};
