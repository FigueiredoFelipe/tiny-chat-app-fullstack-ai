import { Body, Controller, Post } from '@nestjs/common';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async handleMessage(@Body() body: CreateChatDto) {
    return this.chatService.getReply(body.message);
  }
}
