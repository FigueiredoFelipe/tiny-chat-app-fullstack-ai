import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat') // POST /chat
export class ChatController {
  @Post()
  async handleMessage(@Body() body: CreateChatDto) {
    const reply = `Bot: ${body.message}`;
    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { reply };
  }
}
