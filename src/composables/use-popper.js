import { ref, nextTick, watch, unref, onBeforeUnmount } from 'vue';
import { createPopper } from '@popperjs/core';

export default function usePopper({
  offset,
  isOpen,
  boundary = '',
  popperNode,
  triggerNode,
  arrowPadding,
  modifiers = [],
  overflowPadding,
  placement = 'top',
}) {
  const popperInstance = ref(null);

  const setPopperEventListeners = (enabled) =>
    popperInstance.value?.setOptions((options) => ({
      ...options,
      modifiers: [...options.modifiers, { name: 'eventListeners', enabled }],
    }));

  const enablePopperEventListeners = () => setPopperEventListeners(true);
  const disablePopperEventListeners = () => setPopperEventListeners(false);

  const initializePopper = async (trigger, popper) => {
    await nextTick();
    popperInstance.value = createPopper(trigger, popper, {
      placement: unref(placement),
      modifiers: [
        {
          name: 'offset',
          options: {
            offset,
          },
        },
        {
          name: 'arrow',
          options: {
            padding: arrowPadding,
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: overflowPadding,
            boundary: unref(boundary),
          },
        },
        ...modifiers,
      ],
    });

    popperInstance.value.update();
  };

  watch(
    () => ({
      trigger: unref(triggerNode),
      popper: unref(popperNode),
    }),
    async ({ trigger, popper }) => {
      if (!trigger || !popper) return;

      await initializePopper(trigger, popper);
    },
    { immediate: true, flush: 'post' }
  );

  watch([() => isOpen.value, placement], async ([isOpen]) => {
    if (isOpen) {
      await initializePopper(unref(triggerNode), unref(popperNode));
      enablePopperEventListeners();
    } else {
      disablePopperEventListeners();
    }
  });

  onBeforeUnmount(() => {
    if (!popperInstance.value) return;
    popperInstance.value.destroy();
    popperInstance.value = null;
  });

  const update = () => {
    if (!popperInstance.value) return;
    popperInstance.value.update();
  };

  return {
    update,
    popperInstance,
  };
}
