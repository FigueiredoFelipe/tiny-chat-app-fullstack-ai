import { IsNotEmpty, IsString } from 'class-validator';

// ✅ Data Transfer Object used to validate incoming chat requests (POST /chat)
export class CreateChatDto {
  @IsString()
  // ✅ Ensures the message is not an empty string; returns a 400 Bad Request if invalid
  @IsNotEmpty({ message: 'Message cannot be empty.' })
  message: string;
}
