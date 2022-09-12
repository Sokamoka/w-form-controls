<template>
  <div class="w-full">
    <div class="bg-blue-900 w-full p-5">
      <div class="container mx-auto bg-white">
        <div class="flex flex-wrap space-x-5 space-y-2 md:space-y-0">
          <w-input-group>
            <w-popper
              as="div"
              placement="bottom-start"
              :show-triggers="['focusWithin']"
              :hide-triggers="[]"
              hide-on-click-outside
            >
              <w-input v-model="states.origin" label="Origin" />
              <template v-slot:content="{ close }">
                <div class="w-72">
                  Lista
                  <button type="button" @click="close">close</button>
                </div>
              </template>
            </w-popper>
            <w-popper
              as="div"
              placement="bottom-start"
              :show-triggers="['focusWithin']"
              :hide-triggers="[]"
              hide-on-click-outside
            >
              <w-input v-model="states.destination" label="Destination" />
              <template v-slot:content="{ close }">
                <div class="w-72">
                  Lista
                  <button type="button" @click="close">close</button>
                </div>
              </template>
            </w-popper>
          </w-input-group>

          <w-date-picker-range
            v-model="states.departure"
            placement="bottom-start"
            format="YYYY-MM-DD"
            :columns="2"
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
    </div>

    <div>
      <pre>
        Origin: {{ states.origin }}
        Destination: {{ states.destination }}
        Departure: {{ states.departure }}
      </pre>
    </div>

    <div class="container mx-auto">
      {{ states.dropdown }}
      <w-dropdown
        v-model="states.dropdown"
        :options="people"
        placement="bottom-start"
        as="template"
        v-slot:default="{ value }"
      >
        <button type="button" class="bg-pink-500 w-40 focus:bg-pink-300">{{ value ? value.name : 'Dropdown' }}</button>
        <!-- <w-input :value="value" label="Destination" readonly /> -->
      </w-dropdown>
    </div>

    <div class="container mx-auto">
      {{ states.autocomplete }}
      <w-autocomplete
        v-model="states.autocomplete"
        :options="people"
        placement="bottom-start"
        v-slot:default="{ value, input, change, keydown }"
        :display-value="(person) => person.name"
      >
        <w-input :value="value" label="Destination" v-on="{ input, change, keydown }" />
      </w-autocomplete>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import WDatePickerRange from '~/components/form-controls/w-date-picker-range/index.vue';
import WInputGroup from '~/components/form-controls/w-input/input-group.vue';
import WInput from '~/components/form-controls/w-input/index.vue';
import WPopper from '~/components/form-controls/w-popper/index.vue';
import WDropdown from '../components/form-controls/w-dropdown/index.vue';
import WAutocomplete from '../components/form-controls/w-autocomplete/index.vue';
// import { groupedStationsByCountryCode } from '../utils/mock-stations.js';

const isOneWay = ref(false);

const states = reactive({
  origin: null,
  destination: null,
  departure: null,
  dropdown: '',
  autocomplete: undefined,
});

const oneWayLabel = computed(() => {
  return isOneWay.value ? 'One Way' : '';
});
const setOneWay = (value, close) => {
  isOneWay.value = value;
  if (value) states.departure.end = null;
  close();
};

// const destinations = groupedStationsByCountryCode();

const people = [
  { value: 1, name: 'Durward Reynolds', unavailable: false },
  { value: 2, name: 'Kenton Towne', unavailable: false },
  { value: 3, name: 'Therese Wunsch', unavailable: false },
  { value: 4, name: 'Benedict Kessler', unavailable: true },
  { value: 5, name: 'Katelyn Rohan', unavailable: false },
];
</script>
