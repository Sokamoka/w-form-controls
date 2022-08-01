<template>
  <WPopper
    ref="popperRef"
    :placement="placement"
    :show-triggers="['focusWithin']"
    :hide-triggers="[]"
    hide-on-click-outside
    handle-resize
    append-to="body"
  >
    <WInput
      v-model="inputValue"
      :label="label"
      :help="help"
      :name="name"
      :scope="scope"
      readonly
      @focus="$emit('focus')"
      @blur="onBlur"
    >
      <template v-slot:append>
        <CalendarIcon class="icon" />
      </template>
    </WInput>
    <template v-slot:content>
      <Calendar
        :attributes="attributes"
        @dayclick="onChange"
        @daykeydown="onDayKeydown"
      ></Calendar>
    </template>
  </WPopper>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import Calendar from "v-calendar/lib/components/calendar.umd";
import { CalendarIcon } from "@vue-hero-icons/outline";
import WPopper from "../w-popper/index.vue";
import WInput from "../w-input/index.vue";
import { formatDate, unrefElement } from "@vueuse/core";
import { PLACEMENTS } from "../w-popper/internal";

export default {
  name: "DatePicker",

  components: { WPopper, WInput, Calendar, CalendarIcon },

  props: {
    value: {
      type: [Object, Array, Date],
      default: () => ({}),
    },

    name: {
      type: String,
      default: "",
    },

    scope: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "",
    },

    placement: {
      type: String,
      default: "top",
      validator: (value) => PLACEMENTS.includes(value),
    },

    format: {
      type: String,
      default: "MM/DD/YYYY",
    },

    help: {
      type: String,
      default: "",
    },
  },

  setup(props, { emit }) {
    const popperRef = ref(null);
    const inputValue = computed(
      () => props.value && formatDate(props.value, props.format)
    );

    const attributes = computed(() => {
      return [
        {
          highlight: {
            color: "pink",
            fillMode: "light",
          },

          dates: props.value,
        },
      ];
    });

    const onChange = (value) => {
      emit("input", value.date);
    };

    const onBlur = (event) => {
      console.log(event);
      if (popperRef.value?.popperRef.contains(event.relatedTarget)) return;
      emit("blur");
    };

    const onDayKeydown = (event) => {
      const key = event.event.key;
      if ((key === " " || key === "Enter") && !event.isDisabled) {
        emit("input", event.date);
      }
    };

    onMounted(() => {
      console.log(popperRef.value);
    });

    watch(
      () => popperRef.value?.isOpen,
      (open) => {
        if (!open) return;
        nextTick(() => {
          const focusable = unrefElement(popperRef).querySelectorAll(
            '[tabindex]:not([tabindex="-1"])'
          );
          // focusable[0]?.focus();
        });
      }
    );

    return {
      popperRef,
      inputValue,
      attributes,
      onChange,
      onBlur,
      onDayKeydown,
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
