import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const username = ref('');
    const isHosting = ref(false);
    const isConnected = ref(false);

    const setUsername = (newUsername: string) => {
        if (!newUsername || newUsername.trim() === '') {
            console.warn('Username cannot be empty');
            return
        }
        username.value = newUsername.trim()
        sessionStorage.setItem('username', username.value);
    }

    const setIsHosting = (hosting: boolean) => {
        isHosting.value = hosting;
    }

    const setIsConnected = (connected: boolean) => {
        isConnected.value = connected;
    }

    return {
        username,
        isHosting,
        isConnected,
        setUsername,
        setIsHosting,
        setIsConnected
    }
})