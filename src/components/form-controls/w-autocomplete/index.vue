<template>
  <autocomplete
    v-model="modelValue"
    :display-value="displayValue"
    v-slot:default="{ open }"
    @open="onUpdatIsOpen"
    @close="onUpdatIsOpen"
  >
    <autocomplete-input ref="buttonRef" :as="as" @change="onChange" v-slot:default="{ value, input, change, keydown }">
      <slot :value="value" :input="input" :change="change" :keydown="keydown" :suggestion="suggestion" />
    </autocomplete-input>
    <div ref="popperRef" tabindex="-1">
      <transition name="popper-fade" @after-leave="onAfterLeave">
        <autocomplete-options v-if="open" class="max-w-xs bg-white shadow-lg" static>
          <slot name="options">
            <template v-for="option in filtered">
              <autocomplete-option :key="option.value" as="template" :value="option" v-slot="{ active }">
                <slot name="option" :value="option" :active="active">
                  <li :class="[active ? 'bg-gray-300' : 'bg-gray-200']">{{ option.name }}</li>
                </slot>
              </autocomplete-option>
            </template>
          </slot>
        </autocomplete-options>
      </transition>
    </div>
  </autocomplete>
</template>

<script>
import { noop, unrefElement, useResizeObserver } from '@vueuse/core';
import { head } from 'ramda';
import { computed, ref, unref } from 'vue';
import usePopper from '../../../composables/use-popper';
import { PLACEMENTS } from '../w-popper/internal';
import { matchCaps } from '../../../utils/string';
import { Autocomplete, AutocompleteInput, AutocompleteOptions, AutocompleteOption } from './base-autocomplete';

const useSuggestion = (modelValue, options, query, displayValue) => {
  const suggestion = computed(() => {
    if (unref(options).length === 0) return {};
    if (modelValue.value) return modelValue.value;
    return head(unref(options)) ?? {};
  });
  // return suggestion;

  return computed(() => {
    const x = matchCaps(displayValue(suggestion.value), query.value);
    console.log(query.value);
    return x;
  });
};

export default {
  name: 'WAutocomplete',

  inheritAttrs: false,

  components: {
    Autocomplete,
    AutocompleteInput,
    AutocompleteOptions,
    AutocompleteOption,
  },

  props: {
    as: {
      type: String,
      default: 'div',
    },

    value: {
      type: [Object, String],
      deafult: undefined,
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

    displayValue: {
      type: Function,
      default: noop,
    },
  },

  setup(props, { emit }) {
    const isOpen = ref(false);
    const buttonRef = ref(null);
    const popperRef = ref(null);
    const searchQuery = ref('');

    const modelValue = computed({
      get() {
        return props.value;
      },
      set(value) {
        searchQuery.value = value.name;
        emit('input', value);
      },
    });

    const popperNode = computed(() => unrefElement(popperRef.value));

    const { update } = usePopper({
      isOpen,
      // boundary,
      triggerNode: computed(() => unrefElement(buttonRef.value)),
      popperNode,
      // offset: props.offset,
      // modifiers: props.modifiers,
      placement: computed(() => props.placement),
      // arrowPadding: props.arrowPadding,
      // overflowPadding: props.overflowPadding,
    });

    const onUpdatIsOpen = (value) => {
      isOpen.value = value;
    };

    const onInput = (value) => {
      console.log(value instanceof Event);
      if (value instanceof Event) {
        searchQuery.value = value.target.value;
        return;
      }
      searchQuery.value = value;
    };

    const filtered = computed(
      () =>
        props.options.slice().filter((item) => item.name?.toLowerCase().includes(searchQuery.value?.toLowerCase())) ??
        []
    );

    useResizeObserver(popperNode, () => update());

    const suggestion = useSuggestion(
      computed(() => props.value),
      filtered,
      computed(() => searchQuery.value),
      props.displayValue
    );

    return {
      isOpen,
      modelValue,
      buttonRef,
      popperRef,
      filtered,
      searchQuery,
      suggestion,
      onUpdatIsOpen,
      onInput,
      onChange: onInput,
      onAfterLeave: () => (searchQuery.value = ''),
    };
  },
};
</script>
