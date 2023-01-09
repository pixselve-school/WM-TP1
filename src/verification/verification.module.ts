import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import {UsersModule} from "../users/users.module";

@Module({
  providers: [VerificationService],
  controllers: [VerificationController],
  imports: [UsersModule]
})
export class VerificationModule {}
