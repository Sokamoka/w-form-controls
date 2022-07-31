import Vue from "vue";
import VeeValidate from "vee-validate";
import App from "./App.vue";
import "./assets/css/style.css";

Vue.use(VeeValidate, {
  errorBagName: "validatorErrors",
  events: "input|blur",
  classes: false,
  inject: false,
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
