<script setup>
import { onMounted, reactive, ref } from 'vue';
import { InformationCircleIcon, EyeIcon, EyeOffIcon, PhoneIcon, CalendarIcon } from '@vue-hero-icons/outline';
import WInput from './form-controls/w-input/index.vue';
import ShowPassword from './form-controls/show-password/index.vue';
import ShowPasswordButton from './form-controls/show-password/show-password-button.vue';
import BaseInputGroup from './form-controls/w-input/input-group.vue';
import WPopper from './form-controls/w-popper/index.vue';
import useIMask from '../composables/use-imask';
import WDatePicker from './form-controls/w-date-picker/index.vue';
import useShowPassword from '../composables/use-show-password';
import WDatePickerRange from './form-controls/w-date-picker-range/index.vue';

const maskedInputRef = ref(null);
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
  nameday: null,
  check: null,
  // check: { start: new Date(2022, 8, 12), end: new Date(2022, 8, 18) },
});

const { type: passwordFieldType, change } = useShowPassword({ initialValue: 'text' });

const { el, masked, unmasked } = useIMask({
  mask: '+{36} (00) 000-0000',
});

const onCustomEvent = () => {
  console.log('ON-KEYPRESS');
};

onMounted(() => {
  el.value = maskedInputRef.value.inputRef.$el;
});
</script>

<script>
export default {
  $_veeValidate: {
    validator: 'new', // give me my own validator scope.
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
        v-model="formdata.password2"
        v-validate="'required|min:6'"
        name="password2"
        data-vv-as="Data as Password"
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

    <div class="form-container">
      <WDatePicker v-model="formdata.nameday" v-validate="'required'" name="nameday" placement="bottom">
        <template v-slot:default="{ value, click, error, valid }">
          <WInput
            v-model="value"
            label="Name day"
            :valid="valid"
            :error="error"
            helper-text="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
            readonly
            error-message-disabled
            @click.stop="click"
          >
            <template v-slot:append>
              <CalendarIcon class="icon-append" />
            </template>
          </WInput>
        </template>
        <template v-slot:helper="{ error, message }">
          <p v-if="error">{{ message }}</p>
        </template>
      </WDatePicker>
    </div>

    <div class="form-container">
      <w-popper content="Please add valid characters" :triggers="['focusWithin']">
        <BaseInputGroup>
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
        </BaseInputGroup>
      </w-popper>
    </div>

    <div class="form-container">
      <WDatePicker
        v-model="formdata.birthdate"
        v-validate="'required'"
        name="birthdate"
        label="Birth date"
        placement="bottom-end"
        helper-text="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
        append-to="body"
      />
    </div>

    <div class="form-container">
      {{ formdata.check }}
      <WDatePickerRange
        v-model="formdata.check"
        v-validate="'date_range'"
        name="checkin"
        placement="top"
        format="YYYY-MM-DD"
        :columns="2"
      >
        <template v-slot:default="{ error, valid, startId, endId, startDate, endDate, click, focus }">
          <BaseInputGroup>
            <w-input
              :value="startDate"
              label="Check-in"
              :data-start-id="startId"
              :error="error"
              :valid="valid"
              readonly
              @click="click"
              @focus="focus"
            />
            <w-input
              :value="endDate"
              :error="error"
              :valid="valid"
              label="Check-out"
              :data-end-id="endId"
              readonly
              @click="click"
              @focus="focus"
            />
          </BaseInputGroup>
        </template>
      </WDatePickerRange>
    </div>

    <div class="form-container">
      {{ unmasked }}
      <w-input
        ref="maskedInputRef"
        v-model="masked"
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
</style>
