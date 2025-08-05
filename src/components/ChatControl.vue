<template>
    <fieldset role="group">
        <input
            v-model="newMessage"
            @keyup.enter="handleSendMessage"
            placeholder="Type a message..."
            :disabled="!clientPeerStore.clientIsConnected"
        />
        <button class="secondary" @click="handleSendMessage"><Icon icon="material-symbols:send-rounded" /></button>
    </fieldset>
    <fieldset dir="rtl">
        <button @click="sendLike"><Icon icon="material-symbols:thumb-up-rounded" /></button>
        <button class="secondary outline" onclick="uploadDialog2.showModal()">
            <Icon icon="material-symbols:imagesmode-rounded" />
        </button>
    </fieldset>

    <dialog id="uploadDialog2" class="upload-dialog">
        <CardWrapper>
            <header>
                Share Image
            </header>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    :disabled="!clientPeerStore.clientIsConnected"
                    ref="imageInput"
                    @change="previewImage"
                />
            </div>
            <div v-if="imagePreview" style="margin-top: 1rem; text-align: center;">
                <img :src="imagePreview" alt="Preview" style="max-width: 100%; max-height: 200px;" />
            </div>
            <footer>
                <button class="secondary" onclick="uploadDialog2.close()">Close</button>
                <button @click="sendImage" :disabled="!clientPeerStore.clientIsConnected">Share Image</button>
            </footer>
        </CardWrapper>
    </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CardWrapper from './CardWrapper.vue';
import { Icon } from '@iconify/vue';
import { useUserStore } from '@/stores/user';
import { sendMessage } from '@/lib/sendMessage';
import { useClientPeerStore } from '@/stores/clientPeer';
import type { DataConnection } from 'peerjs';

const userStore = useUserStore();
const clientPeerStore = useClientPeerStore();

const newMessage = ref('');
const imageInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string | null>(null);

const handleSendMessage = () => {
    if (!newMessage.value) return;

    sendMessage(
        clientPeerStore.clientConn as DataConnection,
        newMessage.value,
        clientPeerStore.clientPeerId,
        userStore.username
    )

    newMessage.value = '';
};

const sendLike = () => {
    sendMessage(
        clientPeerStore.clientConn as DataConnection,
        `👍`,
        clientPeerStore.clientPeerId,
        userStore.username
    )
};

const sendImage = () => {
    const file = imageInput.value?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

        sendMessage(
            clientPeerStore.clientConn as DataConnection,
            reader.result as ArrayBuffer,
            clientPeerStore.clientPeerId,
            userStore.username,
            'image'
        )

        // Reset everything
        imageInput.value = null;
        imagePreview.value = null;

        const dialog = document.getElementById('uploadDialog2');
        (dialog as HTMLDialogElement).close();
    };

};

const previewImage = () => {
    const file = imageInput.value?.files?.[0];
    if (!file) {
        imagePreview.value = null;
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        imagePreview.value = reader.result as string;
    };

};

onMounted(() => {
    const dialog = document.getElementById('uploadDialog2');
    dialog?.addEventListener('close', () => {
        imageInput.value = null;
        imagePreview.value = null;
    });
});
</script>