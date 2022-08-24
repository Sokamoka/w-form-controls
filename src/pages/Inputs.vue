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
          placeholder="Your e-mail address"
          helper-text="Please add valid email"
        />
      </div>
    </div>

    <h2 class="text-2xl font-bold text-left mb-3">Show password</h2>
    <div class="mb-10 border border-gray-300 p-12 bg-white space-y-10">
      <div class="max-w-xl mx-auto">
        <show-password v-slot="{ type }">
          <w-input
            v-model="states.text3"
            v-validate="'required|min:6'"
            name="password"
            :type="type"
            label="Password"
            placeholder="Password with show password component"
          >
            <template v-slot:append>
              <show-password-button />
            </template>
          </w-input>
        </show-password>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import WInput from '~/components/form-controls/w-input/index.vue';
import ShowPassword from '../components/form-controls/show-password/index.vue';
import ShowPasswordButton from '../components/form-controls/show-password/show-password-button.vue';

const states = reactive({
  text: '',
  text2: '',
  text3: '',
  text4: '',
});
</script>

<script>
export default {
  $_veeValidate: {
    validator: 'new',
  },
};
</script>
