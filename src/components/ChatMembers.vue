<template>
    <section>
        <h4>Members <sup>{{ chatroomStore.members.length }}</sup></h4>
        <ul>
            <li v-for="member in chatroomStore.members" :key="member.peerId" :title="member.peerId">
                {{ member.username }}
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { useChatroomStore } from '@/stores/chatroom';
const chatroomStore = useChatroomStore();
</script>