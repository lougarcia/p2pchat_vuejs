<template>
    <div v-if="!clientPeerStore.clientIsConnected && !userStore.isHosting">
        <p>Connecting to host...</p>
    </div>
    <CardWrapper v-else class="chat-box">
        <template v-if="chatroomStore.messages.length">
            <div v-for="(msg, index) in chatroomStore.messages as Message[]" :key="index" class="speech-bubble">
                <strong>{{ msg.username }}: </strong>
                <span v-if="msg.type === 'text'">{{ msg.text }}</span>
                <img v-else-if="msg.type === 'image'" :src="msg.text as string" class="chat-img" style="max-width: 100px;" />
            </div>
        </template>
        <template v-else>
            <em>No messages yet. Start the conversation!</em>
        </template>
    </CardWrapper>
</template>

<script setup lang="ts">
import CardWrapper from './CardWrapper.vue';
import { useUserStore } from '@/stores/user';
import { useChatroomStore } from '@/stores/chatroom';
import { useClientPeerStore } from '@/stores/clientPeer';
import type { Message } from '@/stores/chatroom';

const userStore = useUserStore();
const chatroomStore = useChatroomStore();
const clientPeerStore = useClientPeerStore();

</script>

<style scoped>
.card {
    min-height: 40dvh;
    overflow-y: scroll;
}

.speech-bubble {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #cccccc50;

    &:nth-child(odd) {
        background-color: #f0f0f0;
    }

    > strong {
        display: block;
        font-weight: bold;
        font-size: 0.75rem;
    }
}
</style>