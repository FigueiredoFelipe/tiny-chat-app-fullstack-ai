import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
// ✅ Marks this class as a service that can be injected (used by ChatService, for example)
export class LlmService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(private readonly config: ConfigService) {
    // ✅ Reads API credentials from environment variables
    this.apiKey = this.config.get<string>('LLM_API_KEY') || '';
    this.apiUrl = this.config.get<string>('LLM_API_URL') || '';
  }

  async ask(message: string): Promise<string> {
    try {
      // ✅ Prompt engineering: enforces domain constraint (Brazilian cuisine expert)
      const prompt = `
        You are an expert in Brazilian cuisine. 
        Only answer questions related to ingredients, preparation, culture, or history of Brazilian food. 
        If the topic is unrelated, politely decline to answer.

        User: ${message}
      `;

      // ✅ Makes POST request to the Gemini API (or any LLM) using axios
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // ✅ Parses the LLM's response and extracts the generated reply
      const data = response.data as any;
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        throw new Error('No valid reply from Gemini API.');
      }

      console.log('Reply:', reply);
      return reply;
    } catch (error) {
      // ✅ Fallback in case of failure, returning a 500 with a meaningful message
      console.error('LLM API Error:', error.message);
      throw new InternalServerErrorException(
        'Failed to get a reply from the LLM.',
      );
    }
  }
}
