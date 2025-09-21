import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import { CallsModule } from './calls/calls.module';
import { ChatModule } from './chat/chat.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    CallsModule,
    ChatModule
  ],
})
export class AppModule {}
