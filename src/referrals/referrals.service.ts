import { Injectable } from '@nestjs/common';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Referral } from './entities/referral.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReferralsService {

  constructor(
    @InjectRepository(Referral)
    private readonly referralReposity: Repository<Referral>
  ) { }

  async create(createReferralDto: CreateReferralDto) {
    return await this.referralReposity.save(createReferralDto);
  }

  async findAll() {
    return await this.referralReposity.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} referral`;
  }

  update(id: number, updateReferralDto: UpdateReferralDto) {
    return `This action updates a #${id} referral`;
  }

  remove(id: number) {
    return `This action removes a #${id} referral`;
  }
}
