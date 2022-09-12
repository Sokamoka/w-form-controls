import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  onMounted,
  onUnmounted,
  toRaw,
  nextTick,
  watch,
  watchEffect,
} from 'vue';
import { noop, onClickOutside, unrefElement } from '@vueuse/core';
import { useId } from '../../../composables/use-id';
import { calculateActiveIndex, Focus } from '../../../utils/calculate-active-index';
// import { isFocusableElement } from '../../utils/focus-management';
import { render } from '../../../utils/vnode/render';

const AutocompleteContext = Symbol('AutocompleteContext');

const nextFrame = (cb) => {
  requestAnimationFrame(() => requestAnimationFrame(cb));
};

const useDropdownContext = (component) => {
  const context = inject(AutocompleteContext, null);

  if (context === null) {
    const err = new Error(`<${component} /> is missing a parent <Dropdown /> component.`);
    if (Error.captureStackTrace) Error.captureStackTrace(err, useDropdownContext);
    throw err;
  }

  return context;
};

export const Autocomplete = defineComponent({
  name: 'Autocomplete',

  props: {
    value: {
      type: [Object, String],
      default: undefined,
    },

    as: {
      type: String,
      default: 'div',
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    displayValue: {
      type: Function,
      default: noop,
    },
  },

  setup(props, { emit }) {
    const { disabled } = props;
    const buttonRef = ref(null);
    const optionsRef = ref(null);
    const activeOptionIndex = ref(null);

    const options = ref([]);

    const isPanelVisible = ref(false);

    const [value, onValueChange, onInput] = useModelValueControl(
      computed(() => props.value),
      (value) => emit('input', value),
      (value) => {
        if (typeof props.displayValue === 'function') {
          onInput(props.displayValue(value)) ?? '';
        } else if (typeof value === 'string') {
          onInput(value);
        } else {
          onInput('');
        }
      }
    );

    const api = {
      value,
      isPanelVisible,
      buttonRef,
      optionsRef,
      // activeOptionIndex,
      options,
      disabled,
      onInput,
      openPanel() {
        if (disabled) return;
        if (isPanelVisible.value) return;
        isPanelVisible.value = true;
        emit('open', true);
      },

      closePanel() {
        if (disabled) return;
        if (!isPanelVisible.value) return;
        isPanelVisible.value = false;
        activeOptionIndex.value = null;
        emit('blur');
        emit('open', false);
      },

      // syncInputValue() {
      //   const value = api.value.value;
      //   console.log(api.buttonRef.value);
      // },

      activeOptionIndex: computed(() => {
        if (activeOptionIndex.value === null && options.value.length > 0) {
          const localActiveOptionIndex = options.value.findIndex((option) => !option.dataRef.disabled);
          if (localActiveOptionIndex !== -1) {
            return localActiveOptionIndex;
          }
        }
        return activeOptionIndex.value;
      }),

      goToOption(focus, id) {
        if (disabled) return;
        if (!isPanelVisible.value) return;

        const nextActiveOptionIndex = calculateActiveIndex(
          focus === Focus.SPECIFIC ? { focus: Focus.SPECIFIC, id } : { focus },
          {
            resolveItems: () => options.value,
            resolveActiveIndex: () => activeOptionIndex.value,
            resolveId: (option) => option.id,
            resolveDisabled: (option) => option.dataRef.disabled,
          }
        );
        if (activeOptionIndex.value === nextActiveOptionIndex) return;
        activeOptionIndex.value = nextActiveOptionIndex;
      },

      select(value) {
        if (disabled) return;
        emit('input', value);
      },

      selectActiveOption() {
        console.log('selectActiveOption', api.activeOptionIndex.value);
        if (api.activeOptionIndex.value === null) {
          // api.select(head(options.value)?.dataRef.value);
          // return;
        }

        let { dataRef, id } = options.value[api.activeOptionIndex.value];
        console.log({ dataRef, id });
        // api.select(dataRef.value);
        onValueChange(dataRef.value);
        api.goToOption(Focus.SPECIFIC, id);
      },

      focus() {
        emit('focus');
      },

      registerOption(id, dataRef) {
        options.value.push({ id, dataRef });
      },

      unregisterOption(id) {
        const nextOptions = options.value.slice();
        const currentActiveOption = activeOptionIndex.value !== null ? nextOptions[activeOptionIndex.value] : null;
        const idx = nextOptions.findIndex((a) => a.id === id);
        if (idx !== -1) nextOptions.splice(idx, 1);
        options.value = nextOptions;
        activeOptionIndex.value = (() => {
          if (idx === activeOptionIndex.value) return null;
          if (currentActiveOption === null) return null;

          // If we removed the option before the actual active index, then it would be out of sync. To
          // fix this, we will find the correct (new) index position.
          return nextOptions.indexOf(currentActiveOption);
        })();
      },
    };

    provide(AutocompleteContext, api);

    onClickOutside(api.optionsRef, (event) => {
      if (unrefElement(buttonRef)?.contains(event.target)) return;
      api.closePanel();
    });

    // Handle outside click
    // useWindowEvent('mousedown', (event) => {
    //   const target = event.target;

    //   if (!isPanelVisible.value) return;

    //   if (dom(buttonRef)?.contains(target)) return;
    //   if (dom(optionsRef)?.contains(target)) return;

    //   api.closePanel();

    //   if (!isFocusableElement(target)) {
    //     event.preventDefault();
    //     dom(buttonRef)?.focus();
    //   }
    // });

    return {
      open: isPanelVisible,
      value,
    };
  },

  render() {
    const slot = {
      open: this.open,
      value: this.value?.value,
    };
    const slots = this.$scopedSlots;

    const data = {
      as: this.$props.as,
    };

    return render({ slot, slots, data, name: 'Autocomplete' });
  },
});

export const AutocompleteInput = defineComponent({
  name: 'AutocompleteInput',

  props: {
    as: {
      type: String,
      default: 'input',
    },
  },

  setup(_, { emit }) {
    const api = useDropdownContext('AutocompleteInput');
    const id = `wa-dropdown-button-${useId()}`;

    const value = computed(() => api.value);

    const onKeyDown = (event) => {
      switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13

        case 'Enter':
          if (!api.isPanelVisible.value) return;
          event.preventDefault();
          event.stopPropagation();

          api.selectActiveOption();
          api.closePanel();
          break;
        case 'ArrowDown':
          event.preventDefault();
          event.stopPropagation();
          if (api.isPanelVisible.value) {
            api.goToOption(Focus.NEXT);
            return;
          }
          api.openPanel();
          break;

        case 'ArrowUp':
          event.preventDefault();
          event.stopPropagation();
          if (api.isPanelVisible.value) {
            api.goToOption(Focus.PREVIOUS);
            return;
          }
          api.openPanel();
          nextTick(() => {
            if (!api.value.value) {
              api.goToOption(Focus.LAST);
            }
          });
          break;
        case 'Home':
        case 'PageUp':
          event.preventDefault();
          event.stopPropagation();
          api.goToOption(Focus.FIRST);
          break;
        case 'End':
        case 'PageDown':
          event.preventDefault();
          event.stopPropagation();
          api.goToOption(Focus.LAST);
          break;
        case 'Escape':
          if (!api.isPanelVisible.value) return;
          event.preventDefault();
          event.stopPropagation();
          api.closePanel();
          break;
        default:
          break;
      }
    };

    const onClick = (event) => {
      if (api.disabled) return;
      if (api.isPanelVisible.value) {
        // event.preventDefault();
        // api.closePanel();
        // nextTick(() => unrefElement(api.buttonRef)?.focus({ preventScroll: true }));
      } else {
        event.preventDefault();
        api.openPanel();
        // nextFrame(() => unrefElement(api.optionsRef)?.focus({ preventScroll: true }));
      }
    };

    onMounted(() => console.log('api.buttonRef:', api.buttonRef.value));

    return {
      id,
      value,
      refEl: api.buttonRef,
      onClick,
      onFocus() {
        api.focus();
      },

      onKeyDown,
      onInput: (event) => {
        api.openPanel();
        api.onInput(event);
        emit('change', event);
      },
      onChange: (event) => emit('change', event),
    };
  },

  render() {
    const api = useDropdownContext('AutocompleteInput');

    const data = {
      as: this.$props.as,
      ref: 'refEl',
      attrs: {
        id: this.id,
        'aria-expanded': api.isPanelVisible.value,
        'aria-controls': unrefElement(api.optionsRef)?.id,
      },

      on: {
        click: this.onClick,
        keydown: this.onKeyDown,
        // keyup: this.onKeyUp,
        focus: this.onFocus,
      },
    };
    const slots = this.$scopedSlots;

    const slot = {
      value: api.value.value,
      click: this.onClick,
      keydown: this.onKeyDown,
      input: this.onInput,
      change: this.onChange,
    };

    return render({ slot, slots, data, name: 'AutocompleteInput' });
  },
});

export const AutocompleteOptions = defineComponent({
  name: 'AutocompleteOptions',

  props: {
    as: {
      type: String,
      default: 'ul',
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
    const api = useDropdownContext('AutocompleteOptions');
    const id = `wa-dropdown-options-${useId()}`;

    const isVisible = computed(() => api.isPanelVisible);

    const onKeydown = (event) => {
      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          event.stopPropagation();
          if (api.activeOptionIndex.value !== null) {
            const { dataRef } = api.options.value[api.activeOptionIndex.value];
            // api.select(dataRef.value);
          }
          api.closePanel();
          nextTick(() => unrefElement(api.buttonRef)?.focus({ preventScroll: true }));
          break;
        case 'ArrowDown':
          event.preventDefault();
          event.stopPropagation();
          return api.goToOption(Focus.NEXT);
        case 'ArrowUp':
          event.preventDefault();
          event.stopPropagation();
          return api.goToOption(Focus.PREVIOUS);
        case 'Home':
        case 'PageUp':
          event.preventDefault();
          event.stopPropagation();
          return api.goToOption(Focus.FIRST);
        case 'End':
        case 'PageDown':
          event.preventDefault();
          event.stopPropagation();
          return api.goToOption(Focus.LAST);
        case 'Escape':
          event.preventDefault();
          event.stopPropagation();
          api.closePanel();
          nextTick(() => unrefElement(api.buttonRef)?.focus({ preventScroll: true }));
          break;
        case 'Tab':
          event.preventDefault();
          event.stopPropagation();
          break;
        default:
          break;
      }
    };

    return {
      id,
      isVisible,
      el: api.optionsRef,
      onKeydown,
    };
  },

  render() {
    const api = useDropdownContext('DropdownOptions');

    const data = {
      as: this.$props.as,
      ref: 'el',
      attrs: {
        id: this.id,
        role: 'listbox',
        tabIndex: 0,
        'aria-labelledby': unrefElement(api.buttonRef)?.id,
      },

      on: {
        keydown: this.onKeydown,
      },
    };

    const slots = this.$scopedSlots;

    const strategy = this.$props.static ? 'static' : this.$props.unmount ? 'unmount' : 'hidden';

    return render({ slots, data, visible: this.isVisible.value, strategy, name: 'AutocompleteOptions' });
  },
});

export const AutocompleteOption = defineComponent({
  name: 'AutocompleteOption',

  props: {
    as: { type: [Object, String], default: 'li' },
    value: { type: [Object, String] },
    disabled: { type: Boolean, default: false },
  },

  setup(props) {
    const api = useDropdownContext('AutocompleteOption');
    const id = `wa-dropbox-option-${useId()}`;
    const { value, disabled } = props;

    const dataRef = ref({ disabled, value });

    const active = computed(() => {
      return api.activeOptionIndex.value !== null ? api.options.value[api.activeOptionIndex.value].id === id : false;
    });

    const selected = computed(() => toRaw(api.value.value) === toRaw(value));

    onMounted(() => api.registerOption(id, dataRef));

    onMounted(() => {
      watch(
        [api.isPanelVisible, selected],
        () => {
          if (!api.isPanelVisible.value) return;
          if (!selected.value) return;
          api.goToOption(Focus.SPECIFIC, id);
          document.querySelector(`#${id}`)?.focus?.();
        },
        { immediate: true }
      );
    });

    onUnmounted(() => api.unregisterOption(id));

    watchEffect(() => {
      if (!api.isPanelVisible.value) return;
      if (!active.value) return;
      nextTick(() => document.querySelector(`#${id}`)?.scrollIntoView?.({ block: 'nearest' }));
    });

    const onClick = (event) => {
      if (disabled) return event.preventDefault();
      api.select(value);
      api.closePanel();
      nextTick(() => unrefElement(api.buttonRef)?.focus({ preventScroll: true }));
    };

    return {
      id,
      active,
      selected,
      onClick,
    };
  },

  render() {
    const attrsWeControl = {
      id: this.id,
      role: 'option',
      tabIndex: -1,
      'aria-disabled': this.disabled === true ? true : undefined,
      'aria-selected': this.selected === true ? this.selected : undefined,
    };

    const data = {
      as: this.$props.as,
      attrs: { ...this.$attrs, ...attrsWeControl },
      on: {
        click: this.onClick,
      },
    };

    const slot = {
      value: this.value,
      active: this.active,
      selected: this.selected,
      disabled: this.disabled,
    };
    const slots = this.$scopedSlots;

    return render({ slot, slots, data, name: 'AutocompleteOption' });
  },
});

const useModelValueControl = (controlledValue, onChange, syncValue) => {
  const internalValue = ref(controlledValue?.value);

  watch(controlledValue, (value) => {
    syncValue(value);
  });

  return [
    internalValue,
    function (value) {
      return onChange?.(value);
    },
    function (value) {
      // console.log('ON-INPUT:', value);
      internalValue.value = value;
    },
  ];
};
