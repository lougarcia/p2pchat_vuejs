<template>
    <section>
        <h4>Members <sup>{{ chatroomStore.members.length }}</sup></h4>
        <ul>
            <li v-for="member in chatroomStore.members" :key="member.peerId" :title="member.peerId">
                {{ member.username }}
                <template v-if="notMe(member.peerId)">
                    <button @click="() => handleSendCallRequest(member.peerId)" class="icon">
                        <Icon icon="material-symbols:add-call-rounded" />
                    </button>
                </template>
            </li>
        </ul>
    </section>
    <CallDialog ref="callDialogRef" :peerId="selectedPeerId" />
</template>

<script setup lang="ts">
import { useChatroomStore } from '@/stores/chatroom';
import { Icon } from '@iconify/vue';
import CallDialog from './CallDialog.vue';
import { ref } from 'vue';

const chatroomStore = useChatroomStore();
const callDialogRef = ref();
const selectedPeerId = ref('');

const notMe = (id:string) => {
    return id != sessionStorage.getItem('clientPeerId')
}

const handleSendCallRequest = (peerId:string) => {
    selectedPeerId.value = peerId;
    callDialogRef.value?.openDialog(true);
}
</script>

<style lang="css" scoped>
.icon {
    padding: 0;
    display: flex inline;
    align-items: center;
    justify-content: center;
    min-height: 1.5rem;
    min-width: 1.5rem;
}
</style>