import { Module } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AssociationsController } from './associations.controller';

@Module({
  controllers: [AssociationsController],
  providers: [AssociationsService],
  imports: [UsersModule],
})
export class AssociationsModule {}
