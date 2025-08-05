<template>
    <header>
        <ToastControl />
        <ChatHeader />
    </header>
    <main v-if="clientPeerStore.clientIsConnected">
        <ChatBox />
        <ChatControl />
    </main>
    <footer>
        <FooterPullTab />
        <ChattingAs />
        <hr>
        <ChatMembers />
        <hr>
    </footer>
</template>

<script setup> // eslint-disable-line
import ChattingAs from './components/ChattingAs.vue';
import ChatHeader from './components/ChatHeader.vue';
import ChatBox from './components/ChatBox.vue';
import ChatControl from './components/ChatControl.vue';
import ChatMembers from './components/ChatMembers.vue';
import FooterPullTab from './components/FooterPullTab.vue';
import ToastControl from './components/ToastControl.vue';
import { useChatroomStore } from '@/stores/chatroom';
import { useHostPeerStore } from '@/stores/hostPeer';
import { useClientPeerStore } from './stores/clientPeer';

const chatroomStore = useChatroomStore();

// create host
const hostPeerId = 'chatroom-host-' + chatroomStore.roomId;
const hostPeerStore = useHostPeerStore();
const {createHost} = hostPeerStore;
createHost(hostPeerId);

// create client peer
const clientPeerStore = useClientPeerStore();
const {createClientAndConnectToHost} = clientPeerStore;
createClientAndConnectToHost(hostPeerId);

// const sendCallRequest = (peerId) => {
//     console.log('Sending request to: ', peerId);
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then(stream => {
//             // Connect to remote peer
//             const call = clientPeer.call(peerId, stream);

//             // When receiving remote stream
//             call.on('stream', remoteStream => {
//                 const video = document.getElementById('video-player');
//                 video.srcObject = remoteStream;
//                 const playPromise = video.play();
//                 if (playPromise !== undefined) {
//                     playPromise.then(_ => { // eslint-disable-line
//                         // Automatic playback started!
//                         // Show playing UI.

//                         // We can now safely pause video...
//                         // video.pause();
//                     })
//                     .catch(error => {
//                         // Auto-play was prevented
//                         // Show paused UI.
//                         console.error(error);
//                     });
//                 }
//             });

//             call.on('error', err => {
//                 console.error('Call error:', err);
//                 addToast(`Call error: ${err}`);
//             });
//         })
//         .catch(err => console.error('Failed to get local stream', err));
// }
</script>