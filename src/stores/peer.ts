import { defineStore } from 'pinia';
import { ref } from 'vue';
import Peer, { DataConnection } from 'peerjs';

export const usePeerStore = defineStore('peer', () => {
    const clientPeer = ref<Peer | null>(null);
    const clientConn = ref<DataConnection | null>(null);
    const clientPeerId = ref('');
    const hostPeer = ref<Peer | null>(null);
    const hostConn = ref<DataConnection | null>(null);
    const hostPeerId = ref('');


    function createPeer(peerId: string, isHost = false) {
        const peer = peerId ? new Peer(peerId) : new Peer();



        if(isHost) {
            hostPeer.value = peer;
        } else {
            clientPeer.value = peer;
        }
    }

    function connectToHost(hostId: string) {
        if (!clientPeer.value) throw new Error('Peer not created yet');
        clientConn.value = clientPeer.value.connect(hostId);
    }

    return {
        clientPeer,
        clientConn,
        clientPeerId,
        hostPeer,
        hostConn,
        hostPeerId,
        createPeer,
        connectToHost,
    };
});