export class MessageDto {
    senderId: number;
    receiverId: number;
    content: String;
    timestamp: Date;
    wasSeen: boolean;

    constructor(senderId: number, receiverId: number, content: String, timestamp: Date){
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
        this.wasSeen = false;
    }
}
