import { computed, ref } from "vue";

export const UseInputMask = ({ pattern = "", mask = "" }) => {
  const input = ref("");

  const format = (val) => {
    return val.replace(/\D/g, "").replace(pattern, mask);
  };

  const masked = computed({
    get() {
      return format(input.value);
    },
    set(value) {
      input.value = value;
    },
  });

  return {
    value: input,
    masked,
  };
};
