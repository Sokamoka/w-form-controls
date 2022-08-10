import { computed, inject } from 'vue';
import { pick } from 'ramda';

export default function useVeeValidator({ name, scope, error, valid }) {
  const validator = inject('$validator', {});

  const validatorFieldFlags = computed(() => {
    const field = validator.fields.find({
      name,
      ...(scope && { scope: scope }),
    });
    return pick(['touched', 'dirty', 'valid', 'pending', 'validated'], field?.flags ?? {});
  });

  const validatorFieldErrorMessage = computed(() => {
    if (scope) return validator.errors.first(name, scope);
    return validator.errors.first(name);
  });

  const hasError = computed(() => {
    const { valid: fieldValid, validated, touched } = validatorFieldFlags.value;
    const fromValidator = !fieldValid && validated && touched;
    return error.value || fromValidator;
  });

  const isValid = computed(() => {
    const { valid: flagValid } = validatorFieldFlags.value;
    return valid.value || flagValid;
  });

  return {
    flags: validatorFieldFlags,
    message: validatorFieldErrorMessage,
    error: hasError,
    valid: isValid,
  };
}
