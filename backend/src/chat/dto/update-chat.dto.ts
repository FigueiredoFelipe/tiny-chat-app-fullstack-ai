import { PartialType } from '@nestjs/mapped-types';

import { CreateChatDto } from './create-chat.dto';

// ✅ Inherits all fields from CreateChatDto, but makes them optional
// Commonly used for PATCH (partial update) operations in REST APIs
export class UpdateChatDto extends PartialType(CreateChatDto) {}
