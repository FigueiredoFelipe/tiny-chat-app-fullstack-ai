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
import { interval, map, Observable, take } from 'rxjs';

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
    const tokens = reply.split(''); // ou .split(' ') para palavras
    return interval(50).pipe(
      take(tokens.length),
      map((i) => ({ data: tokens[i] })),
    );
  }
}
