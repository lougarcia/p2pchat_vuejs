import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const username = ref(sessionStorage.getItem('username') || 'Guest' + Math.floor(Math.random() * 1000))

    const updateUsername = (newUsername: string) => {
        if (!newUsername || newUsername.trim() === '') {
            console.warn('Username cannot be empty')
            return
        }
        username.value = newUsername.trim()
        sessionStorage.setItem('username', username.value)
    }

    return {
        username,
        updateUsername,
    }
})