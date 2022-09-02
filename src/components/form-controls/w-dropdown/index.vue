<template>
  <dropdown v-model="modelValue" v-slot:default="{ value }">
    <dropdown-button :as="as">
      <slot :value="value" />
    </dropdown-button>
    <DropdownOptions>
      <div>HU</div>  
      <DropdownOption as="template" value="A" v-slot="{ active }">
        <li :class="[active ? 'bg-gray-300' : 'bg-gray-200']">A</li>
      </DropdownOption>
      <DropdownOption as="template" value="B" v-slot="{ active }">
        <li :class="[active ? 'bg-gray-300' : 'bg-gray-200']">B</li>
      </DropdownOption>
      <div>EN</div>  
      <DropdownOption as="template" value="C" v-slot="{ active }">
        <li :class="[active ? 'bg-gray-300' : 'bg-gray-200']">C</li>
      </DropdownOption>
    </DropdownOptions>
  </dropdown>
</template>

<script>
import { computed } from 'vue';
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
  },

  setup(props, { emit }) {
    const modelValue = computed({
      get() {
        return props.value;
      },
      set(value) {
        emit('input', value);
      },
    });

    return {
      modelValue,
    };
  },
};
</script>
