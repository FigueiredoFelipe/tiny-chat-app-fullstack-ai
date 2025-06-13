import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty.' })
  message: string;
}
