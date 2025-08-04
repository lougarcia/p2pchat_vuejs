import Peer, { type DataConnection } from 'peerjs';

class HostPeer {
    private peer: Peer | null = null;
    private conn: DataConnection | null = null;

    init(id?: string) {
        this.peer = new Peer(id || '');
        return this.peer;
    }
}

const hostPeer = new HostPeer();
export default hostPeer;