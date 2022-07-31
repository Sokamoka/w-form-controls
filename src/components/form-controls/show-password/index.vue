<script>
import { provide, ref } from "vue";
import { ShowPasswordContext } from "./internal.js";
import { render } from "../../../utils/vnode/render";

export default {
  name: "ShowPassword",

  setup() {
    const type = ref("password");

    const api = {
      type,
      changeType() {
        type.value = type.value === "text" ? "password" : "text";
      },
    };

    provide(ShowPasswordContext, api);

    return {
      type,
    };
  },

  render() {
    const slot = {
      type: this.type,
    };
    const slots = this.$scopedSlots;
    return render({
      data: { as: "template" },
      slots,
      slot,
      name: "ShowPassword",
    });
  },
};
</script>
