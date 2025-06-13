import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            getReply: jest.fn((message: string) => `Bot: ${message}`),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
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
