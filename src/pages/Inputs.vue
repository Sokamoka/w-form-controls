<template>
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold mb-20">Inputs</h1>

    <h2 class="text-2xl font-bold text-left mb-3">Basic usage</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white space-y-10">
      <div class="max-w-xl mx-auto">
        <w-input v-model="states.text" label="Basic usage" />
      </div>

      <div class="max-w-xl mx-auto">
        <w-input
          v-model="states.text2"
          v-validate="'required|email'"
          name="email"
          label="E-mail"
          placeholder="E-mail with helper text"
          helper-text="Please add valid email"
        />
      </div>
    </div>

    <h2 class="text-2xl font-bold text-left mb-3">Show password</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white space-y-10">
      <div class="max-w-xl mx-auto">
        <show-password v-slot="{ type }">
          <w-input
            v-model="states.password"
            v-validate="'required|min:6'"
            name="password"
            :type="type"
            label="Password"
            placeholder="Password with show password Component"
          >
            <template v-slot:append>
              <show-password-button />
            </template>
          </w-input>
        </show-password>
      </div>

      <div class="max-w-xl mx-auto">
        <w-input
          v-model="states.password2"
          v-validate="'required|min:6'"
          :type="passwordFieldType"
          name="password2"
          data-vv-as="From data-vv-as Password"
          label="Password"
          placeholder="Password with show password Composable"
          helper-text="Use space/enter to change input type"
        >
          <template v-slot:append>
            <EyeOffIcon
              v-if="passwordFieldType === 'text'"
              tabindex="0"
              aria-label="Hide Password"
              class="icon-append is-button"
              @click="change"
              @keypress.enter.space.prevent="change"
            />
            <EyeIcon
              v-else
              tabindex="0"
              aria-label="Show Password"
              class="icon-append is-button"
              @click="change"
              @keypress.enter.space.prevent="change"
            />
          </template>
        </w-input>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-left mb-3">Input group</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white space-y-10">
      <w-input-group>
        <w-input
          v-model="states.firstName"
          v-validate="'required'"
          name="firstname"
          label="First name"
          helper-text="First name is required"
        />
        <w-input v-model="states.middleName" label="Middle name" helper-text="Middle name is not required" />
        <w-input
          v-model="states.lastName"
          v-validate="'required'"
          name="lastname"
          label="Last name"
          error-message="Custom required error message"
        />
      </w-input-group>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { EyeIcon, EyeOffIcon } from '@vue-hero-icons/outline';
import WInput from '~/components/form-controls/w-input/index.vue';
import ShowPassword from '../components/form-controls/show-password/index.vue';
import ShowPasswordButton from '../components/form-controls/show-password/show-password-button.vue';
import useShowPassword from '../composables/use-show-password';
import WInputGroup from '../components/form-controls/w-input/input-group.vue';

const states = reactive({
  text: '',
  text2: '',
  password: '',
  password2: '',
  firstName: '',
  middleName: '',
  lastName: '',
});

const { type: passwordFieldType, change } = useShowPassword({ initialValue: 'text' });
</script>

<script>
export default {
  $_veeValidate: {
    validator: 'new',
  },
};
</script>

<styles lang="scss" scoped>
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

  &.is-button {
    cursor: pointer;
    background-color: $color-gray-lighter;
    outline: 8px solid $color-gray-lighter;
    border-radius: 50%;

    &:focus,
    &:hover {
      background-color: $color-gray-light;
      outline-color: $color-gray-light;
    }
  }
}
</styles>
