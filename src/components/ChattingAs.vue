<template>
    <fieldset>
        <label for="username">Chatting as:</label>
        <input
            type="text"
            id="username"
            :value="userStore.username"
            @blur="setUsername"
            placeholder="Enter your username"
            :disabled="!clientPeerStore.clientIsConnected"
        />
    </fieldset>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
import { sendMessage } from '@/lib/sendMessage';
import { useClientPeerStore } from '@/stores/clientPeer';
import type { DataConnection } from 'peerjs';

const userStore = useUserStore();
const clientPeerStore = useClientPeerStore();

const setUsername = (e:Event) => {
    const target = e.target as HTMLInputElement
    if(target.value == userStore.username) return

    userStore.setUsername(target?.value);

    sendMessage(
        clientPeerStore.clientConn as DataConnection,
        target?.value,
        clientPeerStore.clientPeerId,
        userStore.username,
        'user-info'
    )
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