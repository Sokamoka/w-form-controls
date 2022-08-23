<template>
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold mb-20">Date Pickers</h1>

    <h2 class="text-2xl font-bold text-left mb-3">Basic usage</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white">
      <div class="max-w-xl mx-auto">
        <w-date-picker v-model="states.birthdate" placement="bottom-start" v-slot:default="{ value, click }">
          <w-input
            :value="value"
            v-validate="'required'"
            name="birthdate"
            label="Birth date"
            helper-text="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
            :helper-text-sr-only="false"
            readonly
            @click="click"
          >
            <template v-slot:append>
              <CalendarIcon tabindex="-1" class="icon-append is-helper" />
            </template>
          </w-input>
        </w-date-picker>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-left mb-3">With helper text</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white">
      <div class="max-w-xl mx-auto">
        <w-date-picker v-model="states.birthdate2" placement="bottom-start" v-slot:default="{ value, click }">
          <w-input
            :value="value"
            v-validate="'required'"
            name="birthdate2"
            label="Birth date"
            helper-text="Press the arrow keys to navigate by day."
            readonly
            @click="click"
          >
            <template v-slot:append>
              <CalendarIcon tabindex="-1" class="icon-append is-helper" />
            </template>
          </w-input>
        </w-date-picker>
      </div>
    </div>

    <div class="mb-10 border border-gray-300 p-12 bg-white">
      <div class="max-w-xl mx-auto">
        <w-date-picker-range
          v-model="states.check"
          placement="bottom"
          format="YYYY-MM-DD"
          :columns="2"
          helper-text="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
          :helper-text-sr-only="true"
        >
          <template v-slot:default="{ startProps, endProps: { 'data-end-id': endId, value: endDate }, inputEvents }">
            <w-input-group>
              <w-input
                v-bind="startProps"
                v-validate="'required'"
                name="checkin"
                label="Check-in"
                readonly
                v-on="inputEvents"
              />
              <w-input
                :value="endDate"
                :data-end-id="endId"
                v-validate="'required'"
                name="checkout"
                label="Check-out"
                readonly
                v-on="inputEvents"
              />
            </w-input-group>
          </template>
        </w-date-picker-range>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { CalendarIcon } from '@vue-hero-icons/outline';
import WDatePicker from '~/components/form-controls/w-date-picker/index.vue';
import WDatePickerRange from '~/components/form-controls/w-date-picker-range/index.vue';
import WInputGroup from '~/components/form-controls/w-input/input-group.vue';
import WInput from '~/components/form-controls/w-input/index.vue';

const states = reactive({
  birthdate: null,
  birthdate2: null,
  check: null,
});
</script>

<script>
export default {
  $_veeValidate: {
    validator: 'new',
  },
};
</script>

<style lang="scss">
icon-prepend {
  display: block;
  margin: 0 0 0 15px;
  stroke: $color-gray-basic;
}
.icon-append {
  display: block;
  margin: 0 15px 0 0;
  stroke: $color-gray-basic;

  &.is-text {
    stroke: $color-pink-basic;
  }
}
</style>
