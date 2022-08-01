import { computed } from 'vue';
import { pick } from 'ramda';

export default function useVeeValidator(validator, props) {
  const validatorFieldFlags = computed(() => {
    const field = validator.fields.find({
      name: props.name,
      ...(props.scope && { scope: props.nam }),
    });
    return pick(['touched', 'dirty', 'valid', 'pending', 'validated'], field?.flags ?? {});
  });

  const validatorFieldErrorMessage = computed(() => {
    if (props.scope) return validator.errors.first(props.name, props.scope);
    return validator.errors.first(props.name);
  });

  const hasError = computed(() => {
    const { valid, validated, touched } = validatorFieldFlags.value;
    const fromValidator = !valid && validated && touched;
    return props.error || fromValidator;
  });

  const isValid = computed(() => {
    const { valid } = validatorFieldFlags.value;
    return props.valid || valid;
  });

  return {
    validatorFieldFlags,
    validatorFieldErrorMessage,
    hasError,
    isValid,
  };
}
