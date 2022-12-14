import { computed, ref, unref, watch } from 'vue';
import { noop } from '@vueuse/core';
import { useId } from '~/composables/use-id.js';

const STATE_START = 'start';
const STATE_END = 'end';

export default function useDaterRange({
  initialStartDate = null,
  initialEndDate = null,
  closeSelected = true,
  indicateRangeSelection = true,
  update = noop,
  close = noop,
}) {
  const startDate = ref(unref(initialStartDate));
  const endDate = ref(unref(initialEndDate));
  const startRefId = useId();
  const endRefId = useId();
  const state = ref(STATE_START);

  const isStart = computed(() => state.value === STATE_START);

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
    setFocus(STATE_END);
  };

  const endChange = (event) => {
    endDate.value = event.date;
    update(normalizedDateRange());
    setFocus(STATE_END);
    if (!startDate.value) {
      startDate.value = event.date;
      setFocus(STATE_START);
      return;
    }
    if (closeSelected) close();
  };

  const setFocus = (state) => {
    const id = state === STATE_START ? startRefId : endRefId;
    const element = document.querySelector(`[data-${state}-id="${id}"]`);
    element?.focus();
  };

  const setState = (event) => {
    if (event.target.dataset?.startId) {
      state.value = STATE_START;
      return;
    }
    state.value = STATE_END;
  };

  const indicateMouseMove = (event) => {
    if (!indicateRangeSelection) return;
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

  // Minig az aktu??lis ??v/honap oldalra ugrik
  const fromDate = computed(() => {
    if (state.value === 'end') return undefined;
    return initialStartDate.value;
  });

  const toDate = computed(() => {
    if (state.value === 'start') return undefined;
    return initialEndDate.value;
  });

  watch(
    () => ({
      start: unref(initialStartDate),
      end: unref(initialEndDate),
    }),
    ({ start, end }) => {
      startDate.value = start || end; // Calend??rban, ha null akkor minden nam szakasz l??tszik
      endDate.value = end || start;
    }
  );

  return {
    startRefId,
    endRefId,
    state,
    startDate,
    endDate,
    dateRange,
    isReady,
    fromDate,
    toDate,
    change,
    setState,
    resetDates,
    indicateMouseMove,
  };
}
