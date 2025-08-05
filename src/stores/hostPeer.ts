import { defineStore } from 'pinia';
import { ref } from 'vue';
import Peer,  { type DataConnection } from 'peerjs';
import { useToast } from '@/composables/useToast';

export const useHostPeerStore = defineStore('hostPeer', () => {
    const {addToast} = useToast();

    const hostPeer = ref<Peer | null>(null);
    const hostConn = ref<DataConnection | null>(null);
    const hostPeerId = ref('');
    const hostConnections = ref<DataConnection[]>([])


    function createHost(peerId:string) {
        // const peerId = sessionStorage.getItem('hostPeerId') || null;
        hostPeer.value = peerId ? new Peer(peerId) : new Peer();

        hostPeer.value.on('open', (id) => {
            hostPeerId.value = id;
            console.log('Host Peer ID is: ' + id);
        });

        hostPeer.value.on('connection', (connection) => {
            hostConn.value = connection;

            // setupConnectionEvents();
            const index = hostConnections.value.findIndex(c => c.peer === hostConn.value?.peer);
            if(index === -1) {
                hostConnections.value.push(hostConn.value);
            } else {
                hostConnections.value[index] = hostConn.value;
            }

            hostConn.value.on('open', function() {
                console.log('Host connection open with:', hostConn.value?.peer);

                // send members data to everyone
                for (const c of hostConnections.value) {
                    const data = {
                        type: 'chatroom-members',
                        members: hostConnections.value.map(m => ({
                            peerId: m.peer,
                            username: m.metadata.username,
                            isHosting: m.metadata.isHosting,
                            date: m.metadata.date
                        }))
                    }
                    console.log('Sending chatroom-members to:', c.peer, data);
                    if (c.open) {
                        c.send(data);
                        console.log('Data sent:', data);
                    }
                }
            });

            hostConn.value.on('close', function() {
                console.log('Host connection closed with:', hostConn.value?.peer);
            });

            hostConn.value.on('error', function(err) {
                console.error('Host connection error:', err);
            });

            hostConn.value.on('data', function(data) {
                console.log('Host received data:', data);

                // Broadcast to all clients
                for (const c of hostConnections.value) {
                    console.log('Sending data to:', c.peer);
                    if (c.open) {
                        c.send(data);
                    }
                }
            });
        });

        hostPeer.value.on('error', (err) => {
            console.error('Host Peer error TYPE:', err.type);
            console.error('Host Peer error NAME:', err.name);
            console.error('Host Peer error MESSAGE:', err.message);
            console.info('Error creating host... connecting to established host.');
            if(err.type == 'invalid-id') {
                addToast('Error creating host... connecting to established host.');
            }
        });
    }

    return {
        hostPeer,
        hostConn,
        hostPeerId,
        createHost,
    };
});