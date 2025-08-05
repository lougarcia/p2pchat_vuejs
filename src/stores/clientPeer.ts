import { defineStore } from 'pinia';
import { ref } from 'vue';
import Peer, { type DataConnection } from 'peerjs';
import { useToast } from "@/composables/useToast";
import { useChatroomStore } from './chatroom';
import type { Message, Member } from "@/stores/chatroom";
import { useUserStore } from './user';

export const useClientPeerStore = defineStore('clientPeer', () => {
    const userStore = useUserStore();

    const clientPeer = ref<Peer | null>(null);
    const clientConn = ref<DataConnection | null>(null);
    const clientPeerId = ref(sessionStorage.getItem('clientPeerId') || '');
    const clientIsConnected = ref(false)

    const {addToast} = useToast();
    const chatroomStore = useChatroomStore();

    function createClientAndConnectToHost(hostId:string) {
        clientPeer.value = new Peer(clientPeerId.value)

        clientPeer.value.on('open', (id) => {
            clientPeerId.value = id;
            sessionStorage.setItem('clientPeerId', id);
            console.log('My Peer ID is: ' + id);

            connectToHost(hostId);
        });

        // clientPeer.value.on('connection', (connection) => {
        //     clientConn.value = connection;
        //     setupConnectionEvents();
        // });

        // clientPeer.value.on('call', (mediaConnection) => {
        //     // Answer the call with your media stream
        //     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        //         .then(stream => {
        //             mediaConnection.answer(stream); // Send local stream to caller

        //             mediaConnection.on('stream', remoteStream => {
        //                 const video = document.getElementById('remote-video') as HTMLVideoElement;
        //                 video.srcObject = remoteStream;
        //                 video.play();
        //             });
        //         })
        //     .catch(err => console.error('Failed to get local stream', err));
        // });

        clientPeer.value.on('error', (err) => {
            console.error('Client Peer error:', err);
            // connectionError.value = err.message;
        });
    }

    function connectToHost(hostId:string) {
        console.log(`connecting to ${hostId}`);
        if (!clientPeer.value) throw new Error('Peer not created yet');

        clientConn.value = clientPeer.value.connect(hostId, {
            metadata: {
                username: userStore.username,
                isHosting: false,
                date: Date.now()
            }
        });
        console.log(`clientConn.value:`, clientConn.value);

        clientConn.value.on('open', function() {
            console.log('Connection established with host', clientConn.value);
            clientIsConnected.value = true;
            addToast('Connection established with host');
        });

        clientConn.value.on('error', function(err) {
            console.error('Connection error:', err);
        });

        clientConn.value.on('close', function() {
            console.log('Connection closed');
            clientIsConnected.value = false;
            addToast('You were disconnected!', 'error');
        });

        clientConn.value.on('data', function(data) {
            console.log('Received data:', data);
            const message = data as Message;

            switch (message.type) {
                case 'chatroom-members':
                    // Update connections with new members
                    chatroomStore.setMembers(message.members as Member[]);
                    break;
                case 'user-info':
                    const member = chatroomStore.members.find(m => m.peerId == message.peerId)!
                    if(message.peerId != clientPeerId.value) {
                        addToast(`${member.username} has changed username to ${message.text}`);
                    }
                    chatroomStore.setMember(message.peerId, {username: message.text} as Member)
                    break;
                case 'text':
                case 'image':
                    chatroomStore.addMessage(message);
                    break;
                default:
                    console.warn('Unknown data type:', message.type);
            }
        });
    }

    return {
        clientPeer,
        clientConn,
        clientPeerId,
        clientIsConnected,
        createClientAndConnectToHost,
    };
});