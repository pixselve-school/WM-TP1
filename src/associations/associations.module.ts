import { Module } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { UsersModule } from '../users/users.module';
import { AssociationsController } from './associations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Association from './entities/association.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [AssociationsController],
  providers: [AssociationsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Association]), RolesModule],
  exports: [AssociationsService],
})
export class AssociationsModule {}
