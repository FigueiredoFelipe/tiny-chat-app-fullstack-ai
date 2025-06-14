import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
// ✅ Base controller without any path prefix (e.g., responds to GET `/`)
export class AppController {
  // ✅ Dependency injection of the AppService
  constructor(private readonly appService: AppService) {}

  @Get()
  // ✅ Handles HTTP GET requests to the root path (`/`)
  // This can serve as a basic health check or welcome route
  getHello(): string {
    return this.appService.getHello();
  }
}
