<template>
    <fieldset role="group">
        <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
            :disabled="!userStore.isConnected"
        />
        <button class="secondary" @click="sendMessage"><Icon icon="material-symbols:send-rounded" /></button>
    </fieldset>
    <fieldset dir="rtl">
        <button @click="sendLike"><Icon icon="material-symbols:thumb-up-rounded" /></button>
        <button class="secondary outline" onclick="uploadDialog2.showModal()">
            <Icon icon="material-symbols:imagesmode-rounded" />
        </button>
    </fieldset>

    <dialog id="uploadDialog2" class="upload-dialog">
        <article>
            <header>
                Share Image
            </header>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    :disabled="!userStore.isConnected"
                    ref="imageInput"
                    @change="previewImage"
                />
            </div>
            <div v-if="imagePreview" style="margin-top: 1rem; text-align: center;">
                <img :src="imagePreview" alt="Preview" style="max-width: 100%; max-height: 200px;" />
            </div>
            <footer>
                <button class="secondary" onclick="uploadDialog2.close()">Close</button>
                <button @click="sendImage" :disabled="!userStore.isConnected">Share Image</button>
            </footer>
        </article>
    </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useUserStore } from '@/stores/user';

const emits = defineEmits(['send-message']);

const userStore = useUserStore();

const newMessage = ref('');
const imageInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string | null>(null);

const sendMessage = () => {
    if (!newMessage.value) return;

    emits('send-message', newMessage.value);
    newMessage.value = '';
};

const sendLike = () => {
    emits('send-message', `👍`);
};

const sendImage = () => {
    const file = imageInput.value?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        emits('send-message', reader.result, 'image');

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