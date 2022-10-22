import { Module } from '@nestjs/common';
import { MinutesService } from './minutes.service';
import { MinutesController } from './minutes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Minute } from './entities/minute.entity';
import { AssociationsModule } from '../associations/associations.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [MinutesController],
  providers: [MinutesService],
  imports: [
    TypeOrmModule.forFeature([Minute]),
    AssociationsModule,
    UsersModule,
  ],
})
export class MinutesModule {}
