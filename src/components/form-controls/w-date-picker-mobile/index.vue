<template>
  <Dialog inner-focus v-slot="{ open, close }">
    <DialogButton>
      <slot :value="formattedValue" :close="close" />
    </DialogButton>

    <div ref="dialogPanelRef">
      <transition name="fade">
        <div v-if="open" class="dialog relative z-50">
          <div class="dialog-backdrop fixed inset-0 bg-black/30" aria-hidden="true"></div>
          <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel static class="dialog-panel w-full max-w-xs rounded bg-white flex flex-col" v-slot="{ close }">
              <Calendar
                :attributes="attributes"
                :from-page="fromPage"
                is-expanded
                @dayclick="onChange"
                @daykeydown="onDayKeydown"
              />
              <div class="flex flex-row justify-end space-x-5 px-5">
                <button class="border border-gray-500 focus:border-blue-500 p-3" @click="onCancel(close)">
                  Cancel
                </button>
                <button class="border border-gray-500 focus:border-blue-500 p-3" @click="onSelect(close)">OK</button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </transition>
    </div>
  </Dialog>
</template>

<script>
import { unrefElement } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import useVCalendar from '../../../composables/use-v-calendar';
import { appendTo } from '../../../utils/dom';
import Calendar from '../Calendar.vue';
import { Dialog, DialogButton, DialogPanel } from '../w-dialog/base-dialog.js';

export default {
  name: 'WdatePickerMobile',

  inheritAttrs: false,

  components: { Calendar, Dialog, DialogButton, DialogPanel },

  props: {
    value: {
      type: Date,
      default: null,
    },

    format: {
      type: String,
      default: 'MM/DD/YYYY',
    },

    appendTo: {
      type: String,
      default: 'body',
    },
  },

  setup(props, { emit }) {
    const dialogPanelRef = ref(null);

    const { fromPage, attributes, formattedValue, onChange, onDayKeydown, onSelect, onCancel } = useVCalendar({
      modelValue: computed(() => props.value),
      closeAfterSelect: false,
      format: props.format,
      update: (date, close) => {
        emit('input', date);
        close();
      },
      cancel: (close) => close(),
    });

    onMounted(() => appendTo(unrefElement(dialogPanelRef), props.appendTo));

    return {
      formattedValue,
      fromPage,
      attributes,
      dialogPanelRef,
      onChange,
      onCancel,
      onDayKeydown,
      onSelect,
    };
  },
};
</script>

<style lang="scss" scoped>
.vc-container {
  border-color: transparent;
}
</style>
