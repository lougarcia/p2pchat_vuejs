<template>
    <div v-if="!userStore.isConnected && !userStore.isHosting">
        <p>Connecting to host...</p>
    </div>
    <article v-else class="chat-box">
        <template v-if="chatroomStore.messages.length">
            <div v-for="(msg, index) in chatroomStore.messages as Message[]" :key="index" class="speech-bubble">
                <strong>{{ msg.username }}: </strong>
                <span v-if="msg.type === 'text'">{{ msg.text }}</span>
                <img v-else-if="msg.type === 'image'" :src="msg.text" class="chat-img" style="max-width: 100px;" />
            </div>
        </template>
        <template v-else>
            <em>No messages yet. Start the conversation!</em>
        </template>
    </article>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useChatroomStore } from '@/stores/chatroom';
import type { Message } from '@/stores/chatroom';

const userStore = useUserStore();
const chatroomStore = useChatroomStore();

</script>

<style scoped>
article {
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