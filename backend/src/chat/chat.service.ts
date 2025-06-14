import { Injectable } from '@nestjs/common';

import { LlmService } from '../llm/llm.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
// ✅ Marks this class as a service that can be injected into other components (e.g., ChatController)
export class ChatService {
  constructor(private readonly llmService: LlmService) {}

  // ✅ Encapsulates business logic for generating a reply
  // This separation allows for future enhancements like logging, filtering, or analytics
  async getReply(message: string): Promise<{ reply: string }> {
    // You could apply additional logic here before forwarding to the LLM
    const reply = await this.llmService.ask(message);
    return { reply };
  }
}
