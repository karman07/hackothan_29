import { Controller, Get, Param, Query } from '@nestjs/common';
import { CallsService } from './calls.service';
import { Call } from './schemas/call.schema';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  async getAllCalls(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<{ data: Call[]; total: number }> {
    return this.callsService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  async getCallById(@Param('id') id: string): Promise<Call> {
    return this.callsService.findById(id);
  }

  @Get('by-candidate/:name')
  async getCallsByCandidate(@Param('name') name: string): Promise<Call[]> {
    return this.callsService.findByCandidate(name);
  }
}
