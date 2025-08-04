import Peer, { type DataConnection } from 'peerjs';

type ErrorHandler = (err: Error) => void;
type OpenHandler = (id: string) => void;

class ClientPeer {
    private peer: Peer | null = null;
    private conn: DataConnection | null = null;
    private onError: ErrorHandler | null = null;
    private onOpen: OpenHandler | null = null;

    init(id: string, {
        onError,
        onOpen
    } : {
        onError: ErrorHandler,
        onOpen: OpenHandler
    }) {
        this.peer = new Peer(id || '');

        this.peer.on('open', onOpen);
        this.peer.on('error', onError);

        return this.peer;
    }

    connect(remoteId: string): DataConnection {
        if (!this.peer) throw new Error('Peer not initialized');
        this.conn = this.peer.connect(remoteId);
        return this.conn;
    }
}

const clientPeer = new ClientPeer();
export default clientPeer;