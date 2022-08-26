import { computed, ref, unref } from 'vue';
import { getMonth, getYear } from 'date-fns';
import { noop } from '@vueuse/core';
import { useId } from '~/composables/use-id.js';

export default function useDaterRange({
  initialStartDate = null,
  initialEndDate = null,
  closeSelected = true,
  update = noop,
  close = noop,
}) {
  const startDate = ref(unref(initialStartDate));
  const endDate = ref(unref(initialEndDate));
  const startRefId = useId();
  const endRefId = useId();
  const state = ref('start');

  const isStart = computed(() => state.value === 'start');

  const dateRange = computed(() => {
    if (!startDate.value && !endDate.value) return null;
    return { start: startDate.value, end: endDate.value };
  });

  const isReady = computed(() => Boolean(startDate.value) && Boolean(endDate.value));

  const normalizedDateRange = () => {
    if (!isReady.value) return { start: startDate.value, end: endDate.value };
    if (startDate.value > endDate.value) {
      const startDateTemp = unref(startDate);
      const endDateTemp = unref(endDate);
      startDate.value = endDateTemp;
      endDate.value = startDateTemp;
    }
    return { start: startDate.value, end: endDate.value };
  };

  const change = (event) => {
    if (event.isDisabled) return;
    return isStart.value ? changeStart(event) : endChange(event);
  };

  const changeStart = (event) => {
    startDate.value = event.date;
    update(normalizedDateRange());
    endDate.value = endDate.value || event.date;
    setFocus('end');
  };

  const endChange = (event) => {
    endDate.value = event.date;
    update(normalizedDateRange());
    setFocus('end');
    if (!startDate.value) {
      startDate.value = event.date;
      setFocus('start');
      return;
    }
    if (closeSelected) close();
  };

  const setFocus = (state) => {
    const id = state === 'start' ? startRefId : endRefId;
    const element = document.querySelector(`[data-${state}-id="${id}"]`);
    element?.focus();
  };

  const setState = (event) => {
    if (event.target.dataset?.startId) {
      state.value = 'start';
      return;
    }
    state.value = 'end';
  };

  const indicateMouseMove = (event) => {
    if (event.isDisabled) return;
    if (isStart.value) return;
    if (initialEndDate.value) return;
    if (!startDate.value) return;
    endDate.value = event.date;
  };

  const resetDates = () => {
    startDate.value = unref(initialStartDate);
    endDate.value = unref(initialEndDate);
  };

  // Minig az aktuális év/honap oldalra ugrik
  const fromPage = computed(() => {
    const dateType = state.value === 'start' ? startDate.value : endDate.value;
    const year = getYear(dateType);
    const month = getMonth(dateType) + 1;
    return { month, year };
  });

  return {
    startRefId,
    endRefId,
    state,
    startDate,
    endDate,
    dateRange,
    isReady,
    fromPage,
    change,
    setState,
    resetDates,
    indicateMouseMove,
  };
}
