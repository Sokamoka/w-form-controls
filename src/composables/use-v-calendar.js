import { computed, ref, unref } from 'vue';
import { formatDate, noop } from '@vueuse/core';
import { getMonth, getYear, isDate } from 'date-fns';

export default function useVCalendar({ modelValue, update = noop, cancel = noop, closeAfterSelect = true, format }) {
  const selectedDate = ref(unref(modelValue));

  const formattedValue = computed(() => {
    if (!isDate(modelValue.value)) return '';
    return formatDate(modelValue.value, format);
  });

  // Minig az aktuális év/honap oldalra ugrik
  const fromPage = computed(() => {
    const year = getYear(unref(modelValue));
    const month = getMonth(unref(modelValue)) + 1;
    return { month, year };
  });

  const attributes = computed(() => {
    return [
      {
        highlight: {
          color: 'pink',
          fillMode: 'outline',
        },

        dates: selectedDate.value,
      },
    ];
  });

  const onChange = (event) => {
    if (event.isDisabled) return;
    if (!closeAfterSelect) {
      selectedDate.value = event.date;
      return;
    }
    update(event.date);
  };

  const onDayKeydown = (event) => {
    if ([' ', 'Enter'].includes(event.event.key)) {
      event.event.preventDefault();
      onChange(event);
    }
  };

  const onSelect = (close) => {
    update(selectedDate.value, close);
  };

  const onCancel = (close) => {
    selectedDate.value = modelValue.value;
    cancel(close);
  };

  return {
    fromPage,
    attributes,
    formattedValue,
    onSelect,
    onChange,
    onCancel,
    onDayKeydown,
  };
}
