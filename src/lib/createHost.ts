import Peer, { type DataConnection } from 'peerjs';

export async function createHost(hostId: string): Promise<{
    conn: DataConnection | null;
    peer: Peer | null;
    error: Error | null;
}> {
    const peer = new Peer(hostId);
    const connections:DataConnection[] = []

    return new Promise((resolve) => {
        peer.on('open', () => {
            console.log('[Host] Peer is ready:', hostId);

            peer.on('connection', (conn) => {
                console.log('Host received a connection from:', conn.peer);

                // save connection on a list
                // make sure connection is not already in the list
                const index = connections.findIndex(c => c.peer === conn.peer);
                if(index === -1) {
                    connections.push(conn);
                } else {
                    connections[index] = conn;
                }

                // On Open
                conn.on('open', () => {
                    // send members data to everyone
                    for (const c of connections) {
                        const data = {
                            type: 'chatroom-members',
                            members: connections.map(m => ({
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

                    // On Close
                    conn.on('close', function() {
                        console.log('Host connection closed with:', conn.peer);
                    });

                    // On Data
                    conn.on('data', function(data) {
                        console.log('Host received data:', data);

                        // Broadcast to all clients
                        for (const c of connections) {
                            console.log('Sending data to:', c.peer);
                            if (c.open) {
                                c.send(data);
                            }
                        }
                    });

                    resolve({ conn, peer, error: null });
                });

                conn.on('error', (err) => {
                    resolve({ conn: null, peer, error: err });
                });
            });
        });

        peer.on('error', (err) => {
            resolve({ conn: null, peer: null, error: err });
        });
    });
}