import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) { }

  async create(createTicketDto: CreateTicketDto) {
    const errors = await validate(createTicketDto);

    if (errors.length > 0) {
      // Ошибки валидации найдены
      const errorMessages = errors.map(error => Object.values(error.constraints)).flat();
      throw new BadRequestException('Failed');

    }

    const newTicket = {
      name: createTicketDto.name,
      phoneNumber: createTicketDto.phoneNumber,
      // email: createTicketDto.email,
      investSum: createTicketDto.investSum,
      coverLetter: createTicketDto.coverLetter || 'Empty',
      createdAt: new Date().toISOString(),
    }

    return await this.ticketsRepository.save({ ...createTicketDto, createdAt: new Date().toISOString() });
  }

  async findAll() {
    return await this.ticketsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
