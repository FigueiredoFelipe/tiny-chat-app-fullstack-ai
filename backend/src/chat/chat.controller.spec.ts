import { Test, TestingModule } from '@nestjs/testing';

import { LlmService } from '../llm/llm.service';
import { ChatController } from './chat.controller';
import { CreateChatDto } from './dto/create-chat.dto';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    // ✅ Sets up a test module with ChatController and a mocked LlmService
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          // ✅ Provides a mock implementation of LlmService.ask using Jest
          provide: LlmService,
          useValue: {
            ask: jest.fn((message: string) =>
              Promise.resolve(`Bot: ${message}`),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  // ✅ Basic existence test — ensures the controller was instantiated properly
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ✅ Functional test — ensures handleMessage returns expected reply format
  it('should return a reply with Bot prefix', async () => {
    const dto: CreateChatDto = { message: 'Hello' };
    const response = await controller.handleMessage(dto);
    expect(response).toEqual({ reply: 'Bot: Hello' });
  });
});
