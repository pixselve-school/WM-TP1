import { Module } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { UsersModule } from '../users/users.module';
import { AssociationsController } from './associations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Association from './association.entity';

@Module({
  controllers: [AssociationsController],
  providers: [AssociationsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Association])],
})
export class AssociationsModule {}
