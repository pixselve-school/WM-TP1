import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  create(createEventDto: CreateEventDto) {
    const { name, start, end, association } = createEventDto;
    const event = Event.create({
      name,
      start,
      end,
      association: { id: association },
    });
    return this.repository.save(event);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const event = await this.repository.findOne({ where: { id } });
    if (event === null) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const { name, start, end, association } = updateEventDto;
    const event = await this.findOne(id);
    // merge the new data with the existing data
    // this will only update the values that have been provided
    Event.merge(event, {
      name,
      start,
      end,
      association: { id: association },
    });
    return this.repository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    return this.repository.remove(event);
  }
}
