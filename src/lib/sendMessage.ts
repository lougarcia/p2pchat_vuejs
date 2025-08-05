import type { Message } from "@/stores/chatroom";
import type { DataConnection } from "peerjs";

export type SendMessageProps = {
    conn: DataConnection
    data: Message
}

export function sendMessage(
    conn:DataConnection,
    text:string | ArrayBuffer ,
    peerId:string,
    username:string,
    type:Message['type'] = 'text'
) {
    if (!text) return;

    const data:Message = {
        type,
        peerId,
        text,
        username,
        date: Date.now()
    };

    if (conn && conn.open) {
        console.log('Sending data:', data);
        conn.send(data);
    }
}