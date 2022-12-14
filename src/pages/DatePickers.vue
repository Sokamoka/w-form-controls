<template>
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold mb-20">Date Pickers</h1>

    <h2 class="text-2xl font-bold text-left mb-3">Basic usage</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white space-y-10">
      <div class="max-w-xl mx-auto">
        <w-date-picker
          v-model="states.birthdate"
          placement="top"
          :min-date="minDate"
          :max-date="maxDate"
          v-slot:default="{ value, click }"
        >
          <w-input :value="value" label="Birth date" readonly @click="click">
            <template v-slot:append>
              <CalendarIcon tabindex="-1" class="icon-append is-helper" />
            </template>
          </w-input>
        </w-date-picker>
      </div>

      <div class="max-w-xl mx-auto">
        <w-date-picker
          v-model="states.birthdate2"
          format="YYYY-MM-DD"
          placement="bottom-end"
          append-to="body"
          v-slot:default="{ value, click }"
        >
          <w-input
            :value="value"
            v-validate="'required'"
            name="birthdate"
            label="Birth date with validation"
            readonly
            @click="click"
          >
            <template v-slot:append>
              <CalendarIcon tabindex="-1" class="icon-append is-helper" />
            </template>
          </w-input>
        </w-date-picker>
      </div>

      <div class="max-w-xl mx-auto">
        <w-date-picker
          v-model="states.birthdate3"
          placement="bottom-start"
          append-to="body"
          v-slot:default="{ value, click }"
        >
          <w-input
            :value="value"
            v-validate="'required'"
            name="birthdate2"
            label="Birth date"
            placeholder="Birth date with helper text"
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

      <div class="max-w-xl mx-auto">
        <w-date-picker
          v-model="states.birthdate4"
          placement="bottom-start"
          append-to="body"
          v-slot:default="{ value, click }"
        >
          <w-input
            :value="value"
            v-validate="'required'"
            name="birthdate3"
            label="Birth date"
            placeholder="Birth date with screen reader only helper text"
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

    <h2 class="text-2xl font-bold text-left mb-3">With icon trigger</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white">
      <div class="max-w-xl mx-auto">
        {{ states.nameday }}
        <WInput
          ref="namedayInputRef"
          v-model="states.nameday"
          :masked-value="formattedNameday"
          v-validate="'required|date_format:yyyy-MM-dd'"
          name="nameday"
          label="Name day"
          readonly
        >
          <template v-slot:append>
            <w-date-picker
              v-model="states.nameday"
              placement="bottom-end"
              :arrow-padding="19"
              :offset="[0, 15]"
              v-slot:default="{ click }"
            >
              <CalendarIcon tabindex="0" class="icon-append is-button" @click="click" />
            </w-date-picker>
          </template>
        </WInput>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-left mb-3">Date Range</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white space-y-10">
      <div class="max-w-xl mx-auto">
        <w-date-picker-range
          v-model="states.check"
          placement="bottom"
          format="YYYY-MM-DD"
          :columns="2"
          :min-date="minDate"
          :max-date="maxDate"
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

      <div class="max-w-xl mx-auto">
        {{ states.departure }}
        <w-date-picker-range
          v-model="states.departure"
          placement="bottom"
          format="YYYY-MM-DD"
          :columns="2"
          :min-date="minDate"
          :max-date="maxDate"
          :close-after-selection="false"
          :helper-text-sr-only="true"
          :indicate-range-selection="false"
          helper-text="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
        >
          <template v-slot:default="{ startProps, endProps: { 'data-end-id': endId, value: endDate }, inputEvents }">
            <w-input-group>
              <w-input
                v-bind="startProps"
                v-validate="'required'"
                name="departure"
                label="Departure"
                readonly
                v-on="inputEvents"
              />
              <w-input
                :value="endDate"
                :masked-value="oneWayLabel"
                :data-end-id="endId"
                label="Return"
                readonly
                v-on="inputEvents"
              />
            </w-input-group>
          </template>
          <template v-slot:header="{ state }">
            <div class="flex p-3">
              {{ state === 'start' ? 'Departure' : 'Return' }}
            </div>
          </template>
          <template v-slot:footer="{ close }">
            <div class="flex justify-end p-3">
              <button
                class="px-4 py-2 text-pink-500 font-bold underline uppercase text-xs"
                @click="setOneWay(true, close)"
              >
                One way
              </button>
              <button class="px-4 py-2 bg-pink-500 text-white font-bold rounded-md" @click="setOneWay(false, close)">
                OK
              </button>
            </div>
          </template>
        </w-date-picker-range>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-left mb-3">Date picker for Mobile</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white">
      <div class="max-w-xl mx-auto">
        {{ states.nameday }}
        <w-date-picker-mobile v-model="states.nameday" v-slot="{ value }" :available-dates="availableDates">
          <w-input
            :value="value"
            v-validate="'required'"
            name="nameday2"
            label="Name day"
            helper-text="Press Space/Enter to open Date Picker"
            helper-text-sr-only
            readonly
          />
        </w-date-picker-mobile>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { addDays, subDays } from 'date-fns';
import { formatDate } from '@vueuse/core';
import { CalendarIcon } from '@vue-hero-icons/outline';
import WDatePicker from '~/components/form-controls/w-date-picker/index.vue';
import WDatePickerMobile from '~/components/form-controls/w-date-picker-mobile/index.vue';
import WDatePickerRange from '~/components/form-controls/w-date-picker-range/index.vue';
import WInputGroup from '~/components/form-controls/w-input/input-group.vue';
import WInput from '~/components/form-controls/w-input/index.vue';

const states = reactive({
  birthdate: null,
  birthdate2: null,
  birthdate3: null,
  birthdate4: null,
  nameday: null,
  check: null,
  departure: null,
});

const formattedNameday = computed(() => states.nameday && formatDate(states.nameday, 'YYYY-MM-DD'));

const minDate = subDays(new Date(), 60);
const maxDate = addDays(new Date(), 30);

const isOneWay = ref(false);
const oneWayLabel = computed(() => {
  return isOneWay.value ? 'One Way' : '';
});
const setOneWay = (value, close) => {
  isOneWay.value = value;
  if (value) states.departure.end = null;
  close();
};

const availableDates = ["2022-08-04T00:00:00", "2022-08-11T00:00:00", "2022-08-16T00:00:00", "2022-08-23T00:00:00"];
</script>

<script>
export default {
  $_veeValidate: {
    validator: 'new',
  },
};
</script>

<style lang="scss">
.icon-prepend {
  display: block;
  margin: 0 0 0 15px;
  stroke: $color-gray-basic;
}

.icon-append {
  display: block;
  margin: 0 15px 0 0;
  stroke: $color-gray-basic;
  outline: none;

  &.is-text {
    stroke: $color-pink-basic;
  }
}

.is-button {
  border-radius: 100%;
  background-color: $color-gray-lighter;
  outline: 8px solid $color-gray-lighter;
  cursor: pointer;

  &:hover {
    background-color: $color-gray-light;
    outline-color: $color-gray-light;
  }
}
</style>
