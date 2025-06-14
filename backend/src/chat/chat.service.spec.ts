import { Test, TestingModule } from '@nestjs/testing';

import { LlmService } from '../llm/llm.service';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let chatService: ChatService;
  let llmService: LlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: LlmService,
          useValue: {
            ask: jest.fn(),
          },
        },
      ],
    }).compile();

    chatService = module.get<ChatService>(ChatService);
    llmService = module.get<LlmService>(LlmService);
  });

  it('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  describe('getReply', () => {
    it('should return detailed information about Brazilian dishes', async () => {
      const question = 'What are the main ingredients of feijoada?';
      const mockResponse =
        'Feijoada typically includes black beans, pork parts (like ears, feet, ribs), sausage, and spices such as garlic and bay leaves.';

      jest.spyOn(llmService, 'ask').mockResolvedValue(mockResponse);

      const result = await chatService.getReply(question);

      expect(llmService.ask).toHaveBeenCalledWith(question);
      expect(result.reply).toContain('black beans');
      expect(result.reply).toContain('pork');
      expect(result.reply).toContain('sausage');
    });

    it('should provide cooking instructions', async () => {
      const question = 'How do you make pão de queijo?';
      const mockResponse =
        'Pão de queijo is made with tapioca flour, eggs, oil, and cheese (usually Minas cheese). The dough is mixed, shaped into balls, and baked.';

      jest.spyOn(llmService, 'ask').mockResolvedValue(mockResponse);

      const result = await chatService.getReply(question);

      expect(llmService.ask).toHaveBeenCalledWith(question);
      expect(result.reply).toContain('tapioca flour');
      expect(result.reply).toContain('Minas cheese');
      expect(result.reply).toContain('baked');
    });

    it('should handle out-of-scope questions gracefully', async () => {
      const question = 'What’s the theory of relativity?';
      const mockResponse =
        'Im specialized in Brazilian cuisine. I cant answer that, but feel free to ask me something food-related!';

      jest.spyOn(llmService, 'ask').mockResolvedValue(mockResponse);

      const result = await chatService.getReply(question);

      expect(llmService.ask).toHaveBeenCalledWith(question);
      expect(result.reply).toContain('specialized in Brazilian cuisine');
      expect(result.reply).toContain('food-related');
    });
  });
});
