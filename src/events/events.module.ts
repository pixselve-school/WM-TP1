import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AssociationsModule } from '../associations/associations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    AssociationsModule,
    ClientsModule.register([
      {
        name: 'EVENT_NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'events',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
