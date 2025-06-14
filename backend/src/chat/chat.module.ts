import { Module } from '@nestjs/common';

import { LlmModule } from '../llm/llm.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  // ✅ Imports LlmModule so its exported LlmService can be injected here
  imports: [LlmModule],

  // ✅ Registers the controller responsible for handling HTTP routes related to chat
  controllers: [ChatController],

  // ✅ Registers ChatService as a provider (can be injected into the controller if needed)
  providers: [ChatService],
})
export class ChatModule {}
