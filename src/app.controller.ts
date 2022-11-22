import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('MAIL_SERVICE') private client: ClientProxy,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const message = this.client.emit('Hello', 'Hello world');
    console.log(message);
    return this.appService.getHello();
  }
}
