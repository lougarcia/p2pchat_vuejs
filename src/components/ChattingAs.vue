<template>
    <fieldset>
        <label for="username">Chatting as:</label>
        <input
            type="text"
            id="username"
            :value="userStore.username"
            @blur="setUsername"
            placeholder="Enter your username"
            :disabled="!userStore.isConnected"
        />
    </fieldset>
</template>

<script setup> // eslint-disable-line
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';

const userStore = useUserStore();

const emits = defineEmits(['change-user-name']);

const setUsername = (e) => {
    userStore.setUsername(e.target.value);
    emits('change-user-name', e.target.value);
}

onMounted(() => {
    // Initialize username if not set
    if (!userStore.username) {
        const username = sessionStorage.getItem('username') || 'Guest' + Math.floor(Math.random() * 1000)
        userStore.setUsername(username);
    }
});
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