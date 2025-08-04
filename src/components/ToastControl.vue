<!-- components/ToastContainer.vue -->
<template>
    <div class="toast-control">
        <div
            v-for="toast in toasts"
            :key="toast.id"
            class="toast"
            :class="toast.type"
        >
            {{ toast.message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()
</script>

<style scoped>
.toast-control {
    position: fixed;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 9999;
}
.toast {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    color: white;
    font-weight: bold;
    min-width: 200px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.toast.success {
    background-color: #4caf50;
}
.toast.error {
    background-color: #f44336;
}
.toast.info {
    background-color: #2196f3;
}
</style>
