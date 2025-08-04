import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Member = {
    peerId: string;
    username: string;
    isHosting: boolean;
    date: Date;
};

export type Message = {
    type: 'text' | 'image';
    peerId: string
    text: string;
    username: string;
    date: number;
};

export const useChatroomStore = defineStore('chatroom', () => {
    const params = new URLSearchParams(window.location.search);

    const roomId = ref(params.get('id') || 'default-room');
    const name = ref(params.get('name') || '');
    const members = ref([] as Member[]);
    const theme = ref('light');
    const messages = ref([] as Message[]);

    const setMembers = (newMembers: Member[]) => {
        members.value = newMembers || [];
    }

    const setName = (newName: string) => {
        name.value = newName || roomId.value
    }

    const setMember = (id: string, newMember: Member) => {
        const index = members.value.findIndex(m => m.peerId === id);
        if (index !== -1) {
            members.value[index] = {...members.value[index], ...newMember};
        } else {
            console.warn(`Member with id ${id} not found`);
        }
    }

    const setTheme = (newTheme: string) => {
        if (['light', 'dark'].includes(newTheme)) {
            theme.value = newTheme;
        }
    }

    const addMessage = (message: Message) => {
        // if (message && message.username && message.date) {
            messages.value.push(message);
        // }
    }

    return {
        roomId,
        name,
        members,
        theme,
        messages,
        setName,
        setMembers,
        setMember,
        setTheme,
        addMessage
    };
});