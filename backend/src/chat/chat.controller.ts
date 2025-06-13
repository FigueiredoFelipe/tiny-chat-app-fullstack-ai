import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat') // | **Route** | `POST /chat`
export class ChatController {
  @Post() // | **Request body** | `{ "message": "string" }` (JSON)
  async handleMessage(@Body() body: CreateChatDto) {
    const reply = `Bot: ${body.message}`; // | **Response** | echo/prefix "Bot: "

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { reply };
  }
}
