import { CreateEventDto } from './dtos/CreateEvent.dot';
import { EventModel, EventDocument } from './models/EventModel';
import db from '../db';  

class EventService {
    constructor() {
        db().then(() => console.log('Database connected')).catch((err) => console.error('Database connection error:', err));
    }

    async getEventById(id: string): Promise<EventDocument | null> {
        return await EventModel.findById(id).exec();
    }

    async getEvents(): Promise<EventDocument[]> {
        return await EventModel.find().exec();
    }

    async createEvent(eventDto: CreateEventDto): Promise<EventDocument> {
        const newEvent = new EventModel({
            name: eventDto.name,
            description: eventDto.description,
            date: eventDto.date,
            location: eventDto.location,
            duration: eventDto.duration,
        });
        return await newEvent.save();
    }
   
    async getEventsByCity(city: string, page: number, limit: number, sortBy: string, sortDirection: number): Promise<EventDocument[]> {
      try {
          const skip = (page - 1) * limit;
          const sorting = {}
          sorting[sortBy] = sortDirection;
          return await EventModel.find({ location: city }).skip(skip).limit(limit).sort(sorting).exec();
      } catch (error) {
          console.error('Error getting events by city:', error);
          throw new Error('Failed to get events by city');
      }
  }
}

export default EventService;
