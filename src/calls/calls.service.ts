import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Call } from './schemas/call.schema';

@Injectable()
export class CallsService {
  constructor(@InjectModel(Call.name) private callModel: Model<Call>) {}

  async findAll(page = 1, limit = 10): Promise<{ data: Call[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.callModel.find().sort({ timestamp: -1 }).skip(skip).limit(limit).exec(),
      this.callModel.countDocuments().exec(),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<Call> {
    const call = await this.callModel.findById(id).exec();
    if (!call) throw new NotFoundException(`Call with id ${id} not found`);
    return call;
  }

  async findByCandidate(name: string): Promise<Call[]> {
    return this.callModel
      .find({ candidate_name: { $regex: name, $options: 'i' } })
      .sort({ timestamp: -1 })
      .exec();
  }
}
