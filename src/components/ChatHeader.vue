<template>
    <hgroup>
        <h1>
            {{ chatroomStore.roomId }}
        </h1>
        <div>
            <small v-if="userStore.isHosting">HOSTING</small>
            <small v-if="userStore.isConnected">
                CONNECTED
                <sup>{{ chatroomStore.members.length }}</sup>
            </small>
            <small v-else>NOT CONNECTED</small>
        </div>
    </hgroup>
</template>

<script setup> // eslint-disable-line
import { useUserStore } from '@/stores/user';
import { useChatroomStore } from '@/stores/chatroom';

const chatroomStore = useChatroomStore();
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