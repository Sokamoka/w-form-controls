export const dateRange = {
  getMessage: (field, arg) => 'The ' + field + ' value is required.',
  validate: (value) => {
    const isValid = Boolean(value?.start) && Boolean(value?.end);
    return {
      valid: isValid,
      data: {
        required: true,
      },
    };
  },
};
