import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import App from './App.vue';
import { dateRange } from './utils/validation-rules';
import './assets/css/style.css';

Vue.use(VeeValidate, {
  errorBagName: 'validatorErrors',
  events: 'input|blur',
  classes: false,
  inject: false,
});

Validator.extend('date_range', dateRange, {
  computesRequired: true,
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
