import { noop, useTimeoutFn } from '@vueuse/core';
import { computed, ref, unref } from 'vue';
import { useId } from '~/composables/use-id.js';

export default function useDaterRange({
  emit = noop,
  initialStartDate = null,
  initialEndDate = null,
  closeDelay = 5000,
  close = noop,
}) {
  const startDate = ref(unref(initialStartDate));
  const endDate = ref(unref(initialEndDate));
  const startRefId = useId();
  const endRefId = useId();
  const state = ref('start');

  const isStart = computed(() => state.value === 'start');

  const { start, stop } = useTimeoutFn(close, closeDelay, { immediate: false });

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
    return isStart.value ? changeStart(event) : endChange(event);
  };

  const changeStart = (event) => {
    startDate.value = event.date;
    endDate.value = null;
    emit('input', normalizedDateRange());
    endDate.value = event.date;
    setFocus('end');
  };

  const endChange = (event) => {
    endDate.value = event.date;
    emit('input', normalizedDateRange());
    setFocus('end');
    if (!startDate.value) {
      startDate.value = event.date;
      setFocus('start');
      return;
    }
    stop();
    start();
  };

  const setFocus = (state) => {
    const id = state === 'start' ? startRefId : endRefId;
    const element = document.querySelector(`[data-${state}-id="${id}"]`);
    element?.focus();
  };

  const setState = (event) => {
    stop();
    if (event.target.dataset?.startId) {
      state.value = 'start';
      return;
    }
    state.value = 'end';
  };

  const indicateMouseMove = (event) => {
    if (isStart.value) return;
    if (initialEndDate.value) return;
    if (!startDate.value) return;
    endDate.value = event.date;
  };

  const resetDates = () => {
    startDate.value = unref(initialStartDate);
    endDate.value = unref(initialEndDate);
  };

  return {
    startRefId,
    endRefId,
    state,
    startDate,
    endDate,
    dateRange,
    isReady,
    stop,
    change,
    setState,
    resetDates,
    indicateMouseMove,
  };
}
