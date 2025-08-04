// composables/useToast.ts
import { ref } from 'vue';

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

const toasts = ref<Toast[]>([]);

export function useToast() {
    const addToast = (message: string, type: ToastType = 'info', duration = 5000) => {
        const id = Date.now();
        toasts.value.push({ id, message, type, duration });

        setTimeout(() => {
            toasts.value = toasts.value.filter((t) => t.id !== id);
        }, duration);
    }

    return {
        toasts,
        addToast,
    };
}
