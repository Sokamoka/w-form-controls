<script setup>
import { computed, reactive, ref } from 'vue';
import { format, parse } from 'date-fns';
import { InformationCircleIcon, EyeIcon, EyeOffIcon, PhoneIcon, CalendarIcon } from '@vue-hero-icons/outline';
import WInput from './form-controls/w-input/index.vue';
import ShowPassword from './form-controls/show-password/index.vue';
import ShowPasswordButton from './form-controls/show-password/show-password-button.vue';
import WInputGroup from './form-controls/w-input/input-group.vue';
import WPopper from './form-controls/w-popper/index.vue';
import useIMask from '../composables/use-imask';
import WDatePicker from './form-controls/w-date-picker/index.vue';
import useShowPassword from '../composables/use-show-password';
import WDatePickerRange from './form-controls/w-date-picker-range/index.vue';
import HelperText from './form-controls/w-input/helper-text.vue';
import { unrefElement } from '@vueuse/core';

const maskedInputRef = ref(null);
const namedayInputRef = ref(null);
const hasError = ref(false);
const isValid = ref(false);
const isReadonly = ref(false);
const isDisabled = ref(false);
const isLastItemVisible = ref(true);

const formdata = reactive({
  email: '',
  password: '',
  password2: '',
  firstName: '',
  middleName: '',
  lastName: '',
  birthdate: null,
  // birthdate:  new Date(1980, 7, 19),
  nameday: null,
  // nameday: new Date(2020, 7, 19),
  phone: '',
  // phone: '36301234567',
  check: null,
  // check: { start: new Date(2022, 8, 12), end: new Date(2022, 8, 18) },
});

const { type: passwordFieldType, change } = useShowPassword({ initialValue: 'text' });

const { masked, unmasked, typed } = useIMask(
  {
    element: computed(() => unrefElement(maskedInputRef.value?.inputRef)),
    initial: formdata.phone,
    mask: '+{36} (00) 000-0000',
  },
  {
    onComplete: () => (formdata.phone = unmasked.value),
  }
);

const {
  masked: namedayMasked,
  unmasked: namdayUnmasked,
  typed: namedayTyped,
} = useIMask(
  {
    element: computed(() => unrefElement(namedayInputRef.value?.inputRef)),
    initial: formdata.nameday,
    mask: Date,
    pattern: 'Y{-}`m{-}`d',
    lazy: false,
    format: function (date) {
      return (date && format(date, 'yyyy-MM-dd')) || '';
    },
    parse: function (str) {
      return parse(str, 'yyyy-MM-dd', new Date());
    },
    // blocks: {
    //   Y: { mask: IMask.MaskedRange, placeholderChar: 'y', from: 1900, to: 2999, maxLength: 4 },
    //   m: { mask: IMask.MaskedRange, placeholderChar: 'm', from: 1, to: 12, maxLength: 2 },
    //   d: { mask: IMask.MaskedRange, placeholderChar: 'd', from: 1, to: 31, maxLength: 2 },
    // },
    overwrite: true,
  },
  {
    onComplete: () => (formdata.nameday = namedayTyped.value),
  }
);

const onCustomEvent = () => {
  console.log('ON-KEYPRESS');
};
</script>

<script>
export default {
  $_veeValidate: {
    validator: 'new', // give me my own validator scope.
  },

  methods: {
    async validateBeforeSubmit() {
      const result = await this.$validator.validateAll();
      if (result) {
        consoele.log('Form Submitted!');
        return;
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="form-container">
      Value: {{ formdata.email }}
      <div>
        <label>
          <input type="checkbox" v-model="hasError" />
          Error
        </label>
        <label>
          <input type="checkbox" v-model="isValid" />
          Valid
        </label>
        <label>
          <input type="checkbox" v-model="isReadonly" />
          Readonly
        </label>
        <label>
          <input type="checkbox" v-model="isDisabled" />
          Disabled
        </label>
        <label>
          <input type="checkbox" v-model="isLastItemVisible" />
          Last Item Visible
        </label>
      </div>
    </div>

    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-container">
        No helper text:<HelperText></HelperText>
        <HelperText text="Helper text visible"></HelperText>
        <HelperText text="Has error" :error="true"></HelperText>
        Hidden: <HelperText text="Helper text sr only" :helper-sr-only="true"></HelperText>
        <HelperText text="Helper text sr only and has error" :sr-only="true" :error="true"></HelperText>
      </div>
      <div class="form-container">
        <w-input
          v-model="formdata.email"
          v-validate="'required|email'"
          name="email"
          class="test-class"
          label="E-mail"
          type="text"
          :valid="isValid"
          :error="hasError"
          :readonly="isReadonly"
          :disabled="isDisabled"
          helper-text="Please add valid e-mail"
          data-test="email-input"
          @keypress="onCustomEvent"
        >
        </w-input>
      </div>

      <div class="form-container">
        <ShowPassword v-slot="{ type }">
          <w-input
            v-model="formdata.password"
            v-validate="'required|min:6'"
            name="password"
            class="test-class"
            label="Password"
            :type="type"
            helper-text="Please add valid password"
            data-test="password-input"
          >
            <template v-slot:append>
              <ShowPasswordButton />
            </template>
          </w-input>
        </ShowPassword>
      </div>

      <div class="form-container">
        <w-input
          v-model="formdata.birthday"
          label="Number"
          type="tel"
          helper-text="Please add valid password"
          data-test="password-input"
        >
        </w-input>
      </div>

      <div class="form-container">
        <w-input
          v-model="formdata.password2"
          v-validate="'required|min:6'"
          name="password2"
          data-vv-as="From data-vv-as Password"
          class="test-class"
          label="Password"
          :type="passwordFieldType"
          helper-text="Please add valid password"
          data-test="password-input"
        >
          <template v-slot:append>
            <EyeOffIcon
              v-if="passwordFieldType === 'text'"
              tabindex="0"
              aria-label="Hide Password"
              :class="['icon-append']"
              @click="change"
              @keypress.enter.space.prevent="change"
            />
            <EyeIcon
              v-else
              tabindex="0"
              aria-label="Show Password"
              :class="['icon-append']"
              @click="change"
              @keypress.enter.space.prevent="change"
            />
          </template>
        </w-input>
      </div>

      <div class="form-container flex">
        <div>
          <w-date-picker v-model="formdata.birthdate" placement="bottom-start" v-slot:default="{ value, click }">
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
        <div>
          <WInput
            ref="namedayInputRef"
            v-model="namedayTyped"
            :masked-value="namedayMasked"
            v-validate="'required|date_format:yyyy-MM-dd'"
            name="nameday"
            label="Name day"
            helper-text="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
            helper-text-sr-only
          >
            <template v-slot:append>
              <WDatePicker v-model="namedayTyped" placement="bottom-end" v-slot:default="{ click }">
                <CalendarIcon tabindex="0" class="icon-append is-button" @click="click" />
              </WDatePicker>
            </template>
          </WInput>
        </div>
      </div>

      <div class="form-container">
        <w-popper content="Please add valid characters" :triggers="['focusWithin']">
          <w-input-group>
            <w-input
              v-model="formdata.firstName"
              v-validate="'required'"
              name="firstname"
              label="First name"
              helper-text="Please add valid characters"
            />
            <w-input v-model="formdata.middleName" label="Middle name" />
            <w-input
              v-if="isLastItemVisible"
              v-model="formdata.lastName"
              v-validate="'required'"
              name="lastname"
              label="Last name"
              error-message="Custom required error message"
            />
          </w-input-group>
        </w-popper>
      </div>

      <div class="form-container">
        {{ formdata.check }}
        <w-date-picker-range
          v-model="formdata.check"
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

      <div class="form-container">
        <w-input-group>
          <w-input v-model="formdata.firstName" label="Name" />
          <w-date-picker
            v-model="formdata.birthdate"
            placement="bottom-start"
            helper-text-disabled
            v-slot:default="{ value, click }"
          >
            <w-input
              :value="value"
              v-validate="'required'"
              name="birthdate-group"
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
        </w-input-group>
      </div>

      <div class="form-container">
        {{ unmasked }}
        {{ typed }}
        <w-input
          ref="maskedInputRef"
          v-model="unmasked"
          :masked-value="masked"
          inputmode="tel"
          label="Phone"
          helper-text="Lorem Ipsum Information"
        >
          <template v-slot:prepend>
            <PhoneIcon class="icon-prepend" />
          </template>
          <template v-slot:append>
            <w-popper content="Lorem Ipsum Information">
              <InformationCircleIcon class="icon-append" />
            </w-popper>
          </template>
        </w-input>
      </div>

      <div class="form-container">
        <button type="submit">Send</button>
      </div>
    </form>
  </div>
</template>

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
.is-helper {
  outline: none;
}
</style>
