<template>
    <div v-if="!isConnected && !userStore.isHosting">
        <p>Connecting to host...</p>
    </div>
    <div v-else>
        <article>
            <template v-if="messages.length">
                <div v-for="(msg, index) in messages" :key="index" class="speech-bubble">
                    <strong>{{ msg.username }}: </strong>
                    <span v-if="msg.type === 'text'">{{ msg.text }}</span>
                    <img v-else-if="msg.type === 'image'" :src="msg.text" class="chat-img" style="max-width: 100px;" />
                </div>
            </template>
            <template v-else>
                <em>No messages yet. Start the conversation!</em>
            </template>
        </article>

        <fieldset role="group">
            <input
                v-model="newMessage"
                @keyup.enter="sendMessage"
                placeholder="Type a message..."
                :disabled="!isConnected"
            />
            <button class="secondary" @click="sendMessage"><Icon icon="material-symbols:send-rounded" /></button>
        </fieldset>
        <fieldset dir="rtl">
            <button @click="sendLike"><Icon icon="material-symbols:thumb-up-rounded" /></button>
            <button class="secondary outline" onclick="uploadDialog.showModal()">
                <Icon icon="material-symbols:imagesmode-rounded" />
            </button>
        </fieldset>
    </div>
    <dialog id="uploadDialog" class="upload-dialog">
        <article>
            <header>
                Share Image
            </header>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    :disabled="!isConnected"
                    ref="imageInput"
                    @change="previewImage"
                />
            </div>
            <div v-if="imagePreview" style="margin-top: 1rem; text-align: center;">
                <img :src="imagePreview" alt="Preview" style="max-width: 100%; max-height: 200px;" />
            </div>
            <footer>
                <button class="secondary" onclick="uploadDialog.close()">Close</button>
                <button @click="sendImage" :disabled="!isConnected">Send Image</button>
            </footer>
        </article>
    </dialog>
</template>

<script setup> // eslint-disable-line
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

defineProps({
    isConnected: {
        type: Boolean,
        required: true
    },
    messages: {
        type: Array,
        default: () => []
    },
});

const emits = defineEmits(['send-message']);

const newMessage = ref('');
const imageInput = ref(null);
const imagePreview = ref(null);

const sendMessage = () => {
    if (!newMessage.value) return;

    emits('send-message', newMessage.value);
    newMessage.value = '';
};

const sendLike = () => {
    emits('send-message', `👍`);
};

const previewImage = () => {
    const file = imageInput.value?.files?.[0];
    if (!file) {
        imagePreview.value = null;
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        imagePreview.value = reader.result;
    };
    reader.readAsDataURL(file);
};

const sendImage = () => {
    const file = imageInput.value?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        emits('send-message', reader.result, 'image');

        // Reset everything
        imageInput.value.value = '';
        imagePreview.value = null;

        const dialog = document.getElementById('uploadDialog');
        dialog?.close();
    };
    reader.readAsDataURL(file);
};

onMounted(() => {
    const dialog = document.getElementById('uploadDialog');
    dialog?.addEventListener('close', () => {
        if (imageInput.value) imageInput.value.value = '';
        imagePreview.value = null;
    });
});
</script>

<style scoped>
article {
    min-height: 40dvh;
}

fieldset[role=group] {

    input[type="file"] {
        border: 1px solid #cccccc50;
        border-radius: 0.25rem 0 0 0.25rem;
        padding-inline-start: 0.35rem;
    }

    button {
        --pico-form-element-spacing-horizontal: 1rem;
        white-space: nowrap;
    }
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

fieldset:last-of-type {
    display: flex;
    gap: 0.25rem;
}
</style>