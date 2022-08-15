import { computed, ref, unref, watch } from 'vue';
import { useId } from '~/composables/use-id.js';

const useRangeState = () => {
  const state = ref('start');

  return {
    state,
    isStart: () => state.value === 'start',
    step: () => {
      if (state.value === 'start') {
        state.value = 'end';
      } else {
        state.value = 'start';
      }
    },
    set: (event) => {
      if (event.target.dataset?.startId) {
        state.value = 'start';
        return;
      }
      state.value = 'end';
    },
  };
};

export default function useDaterRange({ initialStartDate = null, initialEndDate = null }) {
  const startDate = ref(unref(initialStartDate));
  const endDate = ref(unref(initialEndDate));
  const startRefId = useId();
  const endRefId = useId();

  const state = useRangeState();

  const dateRange = computed(() => {
    if (!startDate.value && !endDate.value) return null;
    return { start: startDate.value, end: endDate.value };
  });

  const normalizedDateRange = () => {
    if (!isReady()) return { start: startDate.value, end: endDate.value };
    if (startDate.value > endDate.value) {
      const startDateTemp = unref(startDate);
      const endDateTemp = unref(endDate);
      startDate.value = endDateTemp;
      endDate.value = startDateTemp;
    }
    return { start: startDate.value, end: endDate.value };
  };

  const isReady = () => {
    return Boolean(startDate.value) && Boolean(endDate.value);
  };

  watch(state.state, (state) => {
    const id = state === 'start' ? startRefId : endRefId;
    const element = document.querySelector(`[data-${state}-id="${id}"]`);
    element?.focus();
  });

  watch(
    () => ({
      start: unref(initialStartDate),
      end: unref(initialEndDate),
    }),
    ({ start, end }) => {
      startDate.value = start || end;
      endDate.value = end || start;
    }
  );

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
    resetDates,
    isReady,
    normalizedDateRange,
  };
}
