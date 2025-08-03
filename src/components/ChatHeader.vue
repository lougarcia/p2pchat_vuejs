<template>
    <hgroup>
        <h1>
            Chatroom: {{ roomId }}
        </h1>
        <div>
            <small v-if="isHosting">HOSTING</small>
            <small v-if="isConnected">
                CONNECTED
                <sup v-if="isHosting">{{ connections.length }}</sup>
            </small>
            <small v-else>NOT CONNECTED</small>
        </div>
    </hgroup>
</template>

<script setup> // eslint-disable-line

defineProps({
    isConnected: {
        type: Boolean,
        required: true
    },
    isHosting: {
        type: Boolean,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    connections: {
        type: Array,
        default: () => []
    }
})

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