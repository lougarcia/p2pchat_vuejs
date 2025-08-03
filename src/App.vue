<template>
    <header>
        <ChatHeader
            :roomId="roomId"
            :isConnected="isConnected"
            :isHosting="isHosting"
            :connections="connections"
        />
    </header>
    <section>
        <ChattingAs :isConnected="isConnected" />
    </section>
    <section>
        <ChatBox
            :isConnected="isConnected"
            :isHosting="isHosting"
            :messages="messages"
            @send-message="sendMessage"
        />
    </section>
</template>

<script setup> // eslint-disable-line
import { ref } from 'vue'
import { Peer } from 'peerjs'
import ChattingAs from './components/ChattingAs.vue'
import ChatHeader from './components/ChatHeader.vue'
import ChatBox from './components/ChatBox.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const peerId = ref(sessionStorage.getItem('peerId') || '')
const isConnected = ref(false)
const isHosting = ref(false)
const messages = ref([])
const connections = ref([])

let conn = null

const params = new URLSearchParams(window.location.search)
const roomId = params.get('id') || 'default-room'
const hostPeerId = 'chatroom-host-' + roomId

const hostPeer = new Peer(hostPeerId);

hostPeer.on('open', function(id) {
    console.log('Host ID is: ' + id);
    isHosting.value = true
});

hostPeer.on('connection', function(connection) {
    console.log('Host received a connection from:', connection.peer);
    connections.value.push(connection);
    console.log('Current connections:', connections.value.length);

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

    connection.on('open', function() {
        console.log('Host connection open with:', connection.peer);
    });

    connection.on('close', function() {
        console.log('Host connection closed with:', connection.peer);
    });

    connection.on('error', function(err) {
        console.error('Host connection error:', err);
    });
});

const clientPeer = new Peer(peerId.value)

clientPeer.on('open', function(id) {
    peerId.value = id;
    sessionStorage.setItem('peerId', id);
    console.log('My Peer ID is: ' + id);

    connectToHost()
});

clientPeer.on('error', function(err) {
    console.error('Client Peer error:', err);
});

function connectToHost() {
    if (!hostPeerId) {
        alert('Please enter a valid Peer ID');
        return;
    }

    conn = clientPeer.connect(hostPeerId);

    conn.on('open', function() {
        console.log('Connection established with host');
        isConnected.value = true;
    });

    conn.on('error', function(err) {
        console.error('Connection error:', err);
    });

    conn.on('close', function() {
        console.log('Connection closed');
        isConnected.value = false;
    });

    conn.on('data', function(data) {
        console.log('Received data:', data);
        if (data.type === 'text' || data.type === 'image') {
            messages.value.push(data);
        } else if (data.type === 'user-info') {
            // Handle user info updates if needed
            console.log('User info:', data);
        }
    });
}

function sendMessage(msg) {
    // const msg = msg.trim();
    if (!msg) return;

    const data = {
        type: 'text',
        sender: peerId.value,
        text: msg ,
        username: userStore.username,
        date: Date.now()
    };

    if (conn && conn.open) {
        console.log('Sending data:', data);
        conn.send(data);
    }
}

// function updateUsername(event) {
//     const username = event.target.value.trim();
//     if (!username) return;

//     const userInfo = { type: 'user-info', sender: peerId.value, username };
//     console.log('Updating username:', userInfo);
//     if (conn && conn.open) {
//         conn.send(userInfo);
//     }
// }
</script>
