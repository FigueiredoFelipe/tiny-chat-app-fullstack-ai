import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { LlmService } from '../llm/llm.service';
import { CreateChatDto } from './dto/create-chat.dto';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: LlmService,
          useValue: {
            ask: jest.fn((message: string) => Promise.resolve(`Bot: ${message}`)),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a reply with Bot prefix', async () => {
    const dto: CreateChatDto = { message: 'Hello' };
    const response = await controller.handleMessage(dto);
    expect(response).toEqual({ reply: 'Bot: Hello' });
  });
});
