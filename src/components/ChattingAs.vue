<template>
    <fieldset role="group">
        <label for="username">Chatting as:</label>
        <input
            type="text"
            id="username"
            :value="userStore.username"
            @blur="userStore.updateUsername($event.target.value)"
            placeholder="Enter your username"
            :disabled="!props.isConnected"
        />
    </fieldset>
</template>

<script setup> // eslint-disable-line
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const props = defineProps({
    isConnected: {
        type: Boolean,
        required: true
    },
})
</script>

<style scoped>
fieldset[role=group] {
    align-items: center;

    label {
        font-weight: bold;
        white-space: nowrap;
        padding-inline-end: 1rem;
    }

    input {
        margin: 0;
    }
}
</style>