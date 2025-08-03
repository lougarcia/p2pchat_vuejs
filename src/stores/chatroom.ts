import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Member = {
    peerId: string;
    username: string;
    isHosting: boolean;
    date: Date;
}

export type Message = {
    type: 'text' | 'image';
    content: string;
    date: Date;
    username: string;
}

export const useChatroomStore = defineStore('chatroom', () => {
    const members = ref([] as Member[])
    const theme = ref('light')
    const messages = ref([] as Message[])

    const setMembers = (newMembers: Member[]) => {
        members.value = newMembers || []
    }

    const setMember = (id: string, newMember: Member) => {
        const index = members.value.findIndex(m => m.peerId === id)
        if (index !== -1) {
            members.value[index] = newMember
        } else {
            console.warn(`Member with id ${id} not found`)
        }
    }

    const setTheme = (newTheme: string) => {
        if (['light', 'dark'].includes(newTheme)) {
            theme.value = newTheme
        }
    }

    const addMessage = (message: Message) => {
        if (message && message.username && message.date) {
            messages.value.push(message)
        }
    }

    return {
        members,
        theme,
        messages,
        setMembers,
        setMember,
        setTheme,
        addMessage
    }
})