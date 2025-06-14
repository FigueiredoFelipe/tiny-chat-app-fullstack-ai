import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LlmService } from './llm.service';

@Module({
  // ✅ Imports ConfigModule to allow access to environment variables in LlmService (e.g., API keys)
  imports: [ConfigModule],

  // ✅ Registers LlmService as a provider for this module
  providers: [LlmService],

  // ✅ Exports LlmService so it can be used by other modules (like ChatModule)
  exports: [LlmService],
})
export class LlmModule {}
