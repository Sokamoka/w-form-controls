import { ref, unref, watch } from 'vue';
import IMask from 'imask';

/* var masked = IMask.createMask({
  mask: '+7 (000) 000-00-00',
  // ...and other options
});
var maskedValue = masked.resolve('71234567890');

// mask keeps state after resolving
console.log(masked.value);  // same as maskedValue
// get unmasked value
console.log(masked.unmaskedValue); */

export default function useIMaskModel(modelValue, props) {
  const mask = ref();
  const masked = ref();
  const unmasked = ref();

  function init() {
    // if (!value) return;
    mask.value = IMask.createMask(props);
  }

  function resolve(value) {
    masked.value = mask.value.resolve(value);
    unmasked.value = mask.value.unmaskedValue;
    // console.log('masked.value:', masked.value);
  }

  watch(modelValue, (value) => {
    console.log({ value });
    resolve(props.format(value));
  });

  watch(masked, (value) => {
    console.log(value);
    resolve(props.format(value));
    // mask.value.value = masked.value;
    // resolve(props.parse(masked.value));
    // modelValue.value = unmasked.value;
  });

  init();

  return {
    masked,
    unmasked,
  };
}
