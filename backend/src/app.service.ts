import { Injectable } from '@nestjs/common';

// ✅ Marks this class as a provider that can be injected into other components (e.g., controllers)
@Injectable()
export class AppService {
  // ✅ Simple method returning a static string
  // In real apps, this might be replaced with business logic or data fetching
  getHello(): string {
    return 'Hello World!';
  }
}
