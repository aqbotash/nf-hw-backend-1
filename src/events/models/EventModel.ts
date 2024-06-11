import mongoose, { Schema, Document } from 'mongoose';

export interface EventDocument extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  duration: string;
}

const EventSchema = new Schema<EventDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
});

export const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
