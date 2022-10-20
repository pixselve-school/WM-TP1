import { Module } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AssociationsController } from './associations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  controllers: [AssociationsController],
  providers: [AssociationsService],
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
})
export class AssociationsModule {}
