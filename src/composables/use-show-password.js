import { ref } from 'vue';

export default function useShowPassword({ initialValue = 'password' }) {
  const type = ref(initialValue);

  const change = () => {
    type.value = type.value === 'text' ? 'password' : 'text';
  };

  return {
    type,
    change,
  };
}
