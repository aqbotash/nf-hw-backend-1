import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot'; // Adjusted import path
import EventService from './event-service';
import { EventDocument } from './models/EventModel';
import { CreateOptions } from 'mongoose';
import { CreateUserDto } from '../auth/dtos/CreateUser.dto';
import { UserCityDto } from '../auth/dtos/UserCity.dto';

class EventController {
    private readonly jwtSecret = process.env.JWT_SECRET || '';
    private readonly jwtRefreshSecret = process.env.JWT_SECRET_SECRET || '';
  
    private eventService: EventService;

    constructor(eventService: EventService) {
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response) => {
        try {
            const event: CreateEventDto  = req.body as {
                name: string;
                description: string,city: string, date: string,  page?: number, limit?: number, 
                location: string;
                duration: string;
            };
            if (!event.name || !event.description || !event.date || !event.location || !event.duration) {
                res.status(400).json({ message: "Send all required fields: name, description, date, location, duration" });
                return;
            }
            const newEvent = await this.eventService.createEvent(event);
            res.status(201).json(newEvent);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getEvents = async (req: Request, res: Response) => {
        try {
            const events = await this.eventService.getEvents();
            res.status(200).json(events);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    
    
    getEventById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const event = await this.eventService.getEventById(id);
            if (!event) {
                res.status(404).json({ error: "Event not found" });
            } else {
                res.status(200).json(event);
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

     getEventsBy = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: UserCityDto = (req as any).user;

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const city = user.city;

        if (!city) {
            res.status(400).json({ error: 'User city not found' });
            return;
        }

        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1; // Default to page 1
        const limit = parseInt(req.query.limit as string) || 10; // Default to limit 10
        const sortBy = req.query.sortBy as string || 'date'; // Default to sort by date
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1; // Default to ascending
        const events: EventDocument[] = await this.eventService.getEventsByCity(city, page, limit, sortBy, sortDirection);

        res.status(200).json(events);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

};

export default EventController;
