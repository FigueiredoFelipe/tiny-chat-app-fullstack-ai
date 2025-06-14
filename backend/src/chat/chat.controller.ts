import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  MessageEvent,
  Post,
  Query,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { LlmService } from '../llm/llm.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
// ✅ All routes in this controller are prefixed with /chat
export class ChatController {
  constructor(private readonly llmService: LlmService) {}

  @Post()
  // ✅ Handles POST /chat
  // Validates request using CreateChatDto and delegates to LlmService
  async handleMessage(@Body() dto: CreateChatDto) {
    const reply = await this.llmService.ask(dto.message);
    return { reply }; // Example: { reply: "Bot: Hello" }
  }

  @Get('stream')
  @Sse()
  @Header('Content-Type', 'text/event-stream')
  // ✅ Handles GET /chat/stream?message=... using Server-Sent Events (SSE)
  // This enables the frontend to receive "typing effect" style streaming
  async streamMessage(
    @Query('message') message: string,
  ): Promise<Observable<MessageEvent>> {
    if (!message || message.trim() === '') {
      // ✅ Returns 400 Bad Request if the message is empty
      throw new BadRequestException('Message cannot be empty.');
    }

    const reply = await this.llmService.ask(message);

    // ✅ Splits reply into tokens (e.g., characters or words)
    const tokens = reply.split(''); // Can be changed to .split(' ') for word-based streaming

    return new Observable<MessageEvent>((observer) => {
      let i = 0;

      const intervalId = setInterval(() => {
        if (i < tokens.length) {
          // ✅ Sends each token as a separate message to simulate typing
          observer.next({ data: tokens[i] });
          i++;
        } else {
          clearInterval(intervalId);
          // ✅ Sends a special end marker to signal that streaming is done
          observer.next({ data: '[[END]]' });
          observer.complete();
        }
      }, 50); // Adjust speed of "typing" here (ms per token)
    });
  }
}
