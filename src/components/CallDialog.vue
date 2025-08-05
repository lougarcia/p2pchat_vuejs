<template>
    <Teleport to="body">
        <div id="callDialog" :class="{active: dialogIsOpen}">
            <CardWrapper>
                <header>
                    <button aria-label="Close" rel="prev" @click="openDialog(false)"></button>
                    Call
                </header>
                <section>
                    <video id="video-player" playsinline></video>
                </section>
                <fieldset>
                    <button class="secondary" @click="handleDropCall">Drop</button>
                    <button @click="handleStartCall">Call</button>
                </fieldset>
            </CardWrapper>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CardWrapper from './CardWrapper.vue';
import { useClientPeerStore } from '@/stores/clientPeer';
import { useUserStore } from '@/stores/user';
import { useToast } from '@/composables/useToast';
import type { MediaConnection } from 'peerjs';

const dialogIsOpen = ref(false)
const cpStore = useClientPeerStore();
const userStore = useUserStore();
const {addToast} = useToast();

const props = defineProps(['peerId']);


const handleStartCall = () => {
    // create connection
    const conn = cpStore.clientPeer?.connect(props.peerId, {
        metadata: {
            type: 'call',
            username: userStore.username,
            isHosting: false,
            date: Date.now()
        }
    });

    // on open
    conn?.on('open', function() {
        console.log('Connection established with peer', props.peerId);

        // initiate the call
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                // Connect to remote peer
                const call = cpStore.clientPeer?.call(props.peerId, stream);

                // When receiving remote stream
                call?.on('stream', remoteStream => {
                    const video = document.getElementById('video-player') as HTMLVideoElement;
                    video.srcObject = remoteStream;
                    const playPromise = video.play();

                    // this if-block maybe unnecessary
                    if (playPromise !== undefined) {
                        playPromise.then(_ => { // eslint-disable-line
                            // Automatic playback started!
                            // Show playing UI.

                            // We can now safely pause video...
                            // video.pause();
                        })
                        .catch(error => {
                            // Auto-play was prevented
                            // Show paused UI.
                            console.error(error);
                        });
                    }
                });

                call?.on('error', err => {
                    console.error('Call error:', err);
                    addToast(`Call error: ${err}`);
                });
            })
        .catch(err => console.error('Failed to get local stream', err));
    });

    // on error
    conn?.on('error', function(err) {
        console.error('Connection error:', err.type, err.message);
        addToast('There was an error connecting to user. Try again later.');
    });

    // on close
    conn?.on('close', function() {
        console.log('Connection closed');
    });
}

const mediaConnection = ref<MediaConnection>();

cpStore.clientPeer?.on('call', (mc) => {

    mediaConnection.value = mc;

    // Answer the call with your media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {

            mediaConnection.value?.answer(stream); // Send local stream to caller
            openDialog(true)

            mediaConnection.value?.on('stream', remoteStream => {
                const video = document.getElementById('video-player') as HTMLVideoElement;
                video.srcObject = remoteStream;
                video.play();
            });
        })
    .catch(err => console.error('Failed to get local stream', err));

    mediaConnection.value.on('close', function() {
        addToast('The call connection was closed', 'error')
    })
});

const handleDropCall = () => {
    mediaConnection.value?.close();
    openDialog(false);
}

const openDialog = (val = true) => {
    dialogIsOpen.value = val;
}

defineExpose({openDialog});
</script>

<style scoped>
#callDialog {
    display: none;
    width: max(300px, 60dvw);

    &.active {
        display: flex;
        position: absolute;
        justify-self: center;
        top: 2rem;
    }

    .card {
        width: 100%;
    }
}

video {
    border: 1px solid grey;
    width: 100%;
    background-color: black;
}

fieldset {
    display: flex;
    column-gap: 0.25rem;
    justify-content: center;
}
</style>