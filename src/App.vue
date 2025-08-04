<template>
    <header>
        <ChatHeader />
    </header>
    <main>
        <ChatBox />
        <ChatControl @send-message="sendMessage" />
    </main>
    <footer>
        <FooterPullTab />
        <ChattingAs @change-user-name="changeUsername" />
        <hr>
        <ChatMembers />
        <hr>
    </footer>
</template>

<script setup> // eslint-disable-line
import { ref } from 'vue';
import { Peer } from 'peerjs';
import ChattingAs from './components/ChattingAs.vue';
import ChatHeader from './components/ChatHeader.vue';
import ChatBox from './components/ChatBox.vue';
import { useUserStore } from '@/stores/user';
import { useChatroomStore } from '@/stores/chatroom';
import ChatControl from './components/ChatControl.vue';
import ChatMembers from './components/ChatMembers.vue';
import FooterPullTab from './components/FooterPullTab.vue';

const userStore = useUserStore();
const chatroomStore = useChatroomStore();

const peerId = ref(sessionStorage.getItem('peerId') || '');
const connections = ref([]);

let conn = null;

const hostPeerId = 'chatroom-host-' + userStore.roomId;

const hostPeer = new Peer(hostPeerId);

hostPeer.on('open', function(id) {
    console.log('Host ID is: ' + id);
    userStore.setIsHosting(true);
});

hostPeer.on('connection', function(connection) {
    console.log('Host received a connection from:', connection.peer);

    // make sure connection is not already in the list
    const index = connections.value.findIndex(c => c.peer === connection.peer);
    if(index === -1) {
        connections.value.push(connection);
    } else {
        connections.value[index] = connection;
    }

    connection.on('open', function() {
        console.log('Host connection open with:', connection.peer);

        // send members data to everyone
        for (const c of connections.value) {
            const data = {
                type: 'chatroom-info',
                members: connections.value.map(m => ({
                    peerId: m.peer,
                    username: m.metadata.username,
                    isHosting: m.metadata.isHosting,
                    date: m.metadata.date
                }))
            }
            console.log('Sending chatroom-info to:', c.peer, data);
            if (c.open) {
                c.send(data);
                console.log('Data sent:', data);
            }
        }
    });

    connection.on('close', function() {
        console.log('Host connection closed with:', connection.peer);
    });

    connection.on('error', function(err) {
        console.error('Host connection error:', err);
    });

    connection.on('data', function(data) {
        console.log('Host received data:', data);

        // Broadcast to all clients
        for (const c of connections.value) {
            console.log('Sending data to:', c.peer);
            if (c.open) {
                c.send(data);
            }
        }
    });
});

const clientPeer = new Peer(peerId.value);

clientPeer.on('open', function(id) {
    peerId.value = id;
    sessionStorage.setItem('peerId', id);
    console.log('My Peer ID is: ' + id);

    connectToHost();
});

clientPeer.on('error', function(err) {
    console.error('Client Peer error:', err);
});

function connectToHost() {
    if (!hostPeerId) {
        alert('Please enter a valid Peer ID');
        return;
    }

    conn = clientPeer.connect(hostPeerId, {
        metadata: {
            username: userStore.username,
            isHosting: userStore.isHosting,
            date: Date.now()
        }
    });

    conn.on('open', function() {
        console.log('Connection established with host', conn);
        userStore.setIsConnected(true);
    });

    conn.on('error', function(err) {
        console.error('Connection error:', err);
    });

    conn.on('close', function() {
        console.log('Connection closed');
        userStore.setIsConnected(false);
    });

    conn.on('data', function(data) {
        console.log('Received data:', data);
        switch (data.type) {
            case 'chatroom-info':
                // Update connections with new members
                chatroomStore.setMembers(data.members);
                break;
            case 'user-info':
                chatroomStore.setMember(data.peerId, {username: data.text})
                break;
            case 'text':
            case 'image':
                chatroomStore.addMessage(data);
                break;
            default:
                console.warn('Unknown data type:', data.type);
        }
    });
}

const sendMessage = (msg, type = "text") => {
    // const msg = msg.trim();
    if (!msg) return;

    const data = {
        type,
        peerId: peerId.value,
        text: msg ,
        username: userStore.username,
        date: Date.now()
    };

    if (conn && conn.open) {
        console.log('Sending data:', data);
        conn.send(data);
    }
}

const changeUsername = () => {
    sendMessage(userStore.username, "user-info")
}
</script>