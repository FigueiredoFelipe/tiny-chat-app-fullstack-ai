import { Injectable } from '@nestjs/common';

import { LlmService } from '../llm/llm.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly llmService: LlmService) {}

  async getReply(message: string): Promise<{ reply: string }> {
    // Aqui você pode aplicar validações ou manipular a mensagem, se quiser
    const reply = await this.llmService.ask(message);
    return { reply };
  }
}
