<template>
    <hgroup>
        <h1>
            <Icon icon="material-symbols:chat-rounded" /> {{ chatroomStore.roomId }}
        </h1>
        <div>
            <small v-if="hostPeerStore.hostPeerId">HOSTING</small>
            <small v-if="clientPeerStore.clientIsConnected">
                CONNECTED
                <sup>{{ chatroomStore.members.length }}</sup>
            </small>
            <small v-else>NOT CONNECTED</small>
        </div>
    </hgroup>
</template>

<script setup> // eslint-disable-line
import { useChatroomStore } from '@/stores/chatroom';
import { useHostPeerStore } from '@/stores/hostPeer';
import { useClientPeerStore } from '@/stores/clientPeer';
import { Icon } from '@iconify/vue';

const chatroomStore = useChatroomStore();
const hostPeerStore = useHostPeerStore();
const clientPeerStore = useClientPeerStore();

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