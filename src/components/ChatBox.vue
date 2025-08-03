<template>
    <div v-if="!isConnected && !isHosting">
        <p>Connecting to host...</p>
    </div>
    <div v-else>
        <article>
            <template v-if="messages.length">
                <div v-for="(msg, index) in messages" :key="index" class="speech-bubble">
                    <strong>{{ msg.username }}: </strong>
                    <span v-if="msg.type === 'text'">{{ msg.text }}</span>
                    <img v-else-if="msg.type === 'image'" :src="msg.data" class="chat-img" />
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
                />
            </div>
            <footer>
                <button class="secondary" onclick="uploadDialog.close()">Close</button>
                <button @click="sendImage" :disabled="!isConnected">Send Image</button>
            </footer>
        </article>
    </dialog>
</template>

<script setup> // eslint-disable-line
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

defineProps({
    isConnected: {
        type: Boolean,
        required: true
    },
    isHosting: {
        type: Boolean,
        required: true
    },
    messages: {
        type: Array,
        default: () => []
    },
})

const emits = defineEmits(['send-message']);

const newMessage = ref('');

const sendMessage = () => {
    if (!newMessage.value) return;
    // Emit the message to the parent component
    emits('send-message', newMessage.value);
    // Clear the input field after sending
    newMessage.value = '';
};

const sendLike = () => {
    // Emit a like message
    emits('send-message', `👍`);
};

const sendImage = () => {
    // Emit an image message
    // const imageData = 'data:image/png;base64,...'; // Placeholder for actual image data
    // emits('send-message', { type: 'image', data: imageData });
};
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
}

fieldset:last-of-type {
    display: flex;
    gap: 0.25rem;
}
</style>