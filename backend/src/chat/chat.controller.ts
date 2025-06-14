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
export class ChatController {
  constructor(private readonly llmService: LlmService) {}

  @Post()
  async handleMessage(@Body() dto: CreateChatDto) {
    const reply = await this.llmService.ask(dto.message);
    return { reply };
  }

  @Get('stream')
  @Sse()
  @Header('Content-Type', 'text/event-stream')
  async streamMessage(
    @Query('message') message: string,
  ): Promise<Observable<MessageEvent>> {
    if (!message || message.trim() === '') {
      throw new BadRequestException('Message cannot be empty.');
    }

    const reply = await this.llmService.ask(message);
    console.log({ reply });
    const tokens = reply.split(''); // ou .split(' ') se preferir palavra a palavra
    console.log({ tokens });
    return new Observable<MessageEvent>((observer) => {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < tokens.length) {
          observer.next({ data: tokens[i] });
          i++;
        } else {
          clearInterval(intervalId);
          observer.next({ data: '[[END]]' }); // ✅ Marcação de fim
          observer.complete();
        }
      }, 50);
    });
  }
}
