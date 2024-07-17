import { MessageType } from "../enums/message-type";

export interface Message {
  senderMail: string;
  type: MessageType;
  description: string;
  senderImage: string;
  completed: boolean;
}
