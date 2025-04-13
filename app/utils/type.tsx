import { ObjectId } from "mongodb";

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
}

export interface Message {
  _id: ObjectId;
  phone: string;
  otp: number;
  message: string;
  status: string;
  twilioSid: string;
  sentAt: Date;
}

export interface EnrichedMessage extends Message {
  fullname: string;
}
