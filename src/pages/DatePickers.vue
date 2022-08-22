<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-20">Date Pickers</h1>

    <div class="mb-10 border border-gray-300 p-12 bg-white">
      <div class="max-w-xl mx-auto">
        <w-date-picker v-model="states.birthdate" placement="bottom-start" v-slot:default="{ value, click }">
          <w-input
            :value="value"
            v-validate="'required'"
            name="birthdate"
            label="Birth date"
            helper-text="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
            helper-text-sr-only
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
        <w-date-picker v-model="states.birthdate2" placement="bottom-start" v-slot:default="{ value, click }">
          <w-input
            :value="value"
            v-validate="'required'"
            name="birthdate2"
            label="Birth date"
            helper-text="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
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
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { CalendarIcon } from '@vue-hero-icons/outline';
import WDatePicker from '~/components/form-controls/w-date-picker/index.vue';
import WInput from '~/components/form-controls/w-input/index.vue';

const states = reactive({
  birthdate: null,
  birthdate2: null,
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
