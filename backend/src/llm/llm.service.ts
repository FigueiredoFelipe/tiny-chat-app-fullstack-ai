import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LlmService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('LLM_API_KEY') || '';
    this.apiUrl = this.config.get<string>('LLM_API_URL') || '';
  }

  async ask(message: string): Promise<string> {
    try {
      const prompt = `
        You are an expert in Brazilian cuisine. 
        Only answer questions related to ingredients, preparation, culture, or history of Brazilian food. 
        If the topic is unrelated, politely decline to answer.

        User: ${message}
      `;

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

      const data = response.data as any;
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        throw new Error('No valid reply from Gemini API.');
      }

      console.log('API URL:', this.apiUrl);
      console.log('API KEY:', this.apiKey);

      return reply;
    } catch (error) {
      console.error('LLM API Error:', error.message);
      throw new InternalServerErrorException(
        'Failed to get a reply from the LLM.',
      );
    }
  }
}
