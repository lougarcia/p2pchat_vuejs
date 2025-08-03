<template>
    <hgroup>
        <h1>
            Chatroom: {{ roomId }}
        </h1>
        <div>
            <small v-if="userStore.isHosting">HOSTING</small>
            <small v-if="isConnected" onclick="connectedDialog.showModal()">
                CONNECTED
                <sup>{{ chatroomStore.members.length }}</sup>
            </small>
            <small v-else>NOT CONNECTED</small>
        </div>
    </hgroup>
    <dialog id="connectedDialog">
        <article>
            <header>
                Members: {{ chatroomStore.members.length }}
            </header>
            <div>
                <ul>
                    <li v-for="member in chatroomStore.members" :key="member.peerId">
                        {{ member.username }} <small>{{ member.peerId }}</small>
                    </li>
                </ul>
            </div>
            <footer>
                <button class="secondary" onclick="connectedDialog.close()">Close</button>
            </footer>
        </article>
    </dialog>
</template>

<script setup> // eslint-disable-line
import { useUserStore } from '@/stores/user';
import { useChatroomStore } from '@/stores/chatroom';

const chatroomStore = useChatroomStore();

defineProps({
    isConnected: {
        type: Boolean,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
});

const userStore = useUserStore();

</script>

<style scoped>
hgroup {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;

    small {
        font-size: 0.8rem;
        font-weight: bold;
        color: green;
        white-space: nowrap;
        cursor: pointer;
    }

    > div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    @media screen and (max-width: 768px) {
        flex-direction: column-reverse;
        & > h1 {
            align-self: flex-start;
        }

        & > div {
            align-self: flex-end;
        }
    }
}
</style>