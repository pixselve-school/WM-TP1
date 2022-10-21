import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AssociationsModule } from './associations/associations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import Association from './associations/association.entity';

@Module({
  imports: [
    UsersModule,
    AssociationsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mydatabase.db',
      entities: [User, Association],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
