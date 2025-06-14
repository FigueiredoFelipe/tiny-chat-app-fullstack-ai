import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    // ✅ Loads .env variables globally (used for rate limiting, API keys, etc.)
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Sets up request throttling dynamically using values from environment variables
    // This prevents abuse by limiting requests per IP (e.g., 5 requests per 60 seconds)
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: parseInt(configService.get('RATE_LIMIT_TTL', '60'), 10), // ⏱ Time window in seconds
        limit: parseInt(configService.get('RATE_LIMIT_MAX_PER_TTL', '5'), 10), // 🚫 Max requests per window
      }),
    }),

    // ✅ Importing app-specific feature modules
    ChatModule,
    LlmModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // ✅ Applies the throttling guard globally across all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
