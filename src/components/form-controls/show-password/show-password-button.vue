<template>
  <EyeIcon
    tabindex="0"
    :class="mainClasses"
    aria-label="Show Password"
    @click="change"
    @keypress.enter.space.prevent="change"
  />
</template>
<script>
import { computed, inject } from "vue";
import { EyeIcon } from "@vue-hero-icons/outline";
import { ShowPasswordContext } from "./internal.js";

export default {
  name: "ShowPasswordButton",

  components: {
    EyeIcon,
  },

  setup() {
    const api = inject(ShowPasswordContext, null);

    const mainClasses = computed(() => [
      "icon",
      {
        "is-text": api.type.value === "text",
      },
    ]);

    return {
      mainClasses,
      change: api.changeType,
    };
  },
};
</script>

<style lang="scss" scoped>
.icon {
  margin-right: 15px;
  cursor: pointer;
  stroke: #bbb;
}
.icon.is-text {
  stroke: $color-pink-basic;
}
</style>
