import { Controller, Get, HttpCode, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { get } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

@Get()
//@Redirect('https://docs.nestjs.com', 302)
getDocs() {
  return this.appService.getHello();
}
}
