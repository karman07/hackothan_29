import { Controller, Post, Get, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    const reply = await this.chatService.getReply(message);
    return { reply };
  }

  @Get('health')
  health() {
    return { status: 'OK', message: 'EduVerify Chatbot API is running' };
  }
}
