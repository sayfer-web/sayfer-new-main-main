import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {

  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) { }

  async create(createNewsDto: CreateNewsDto) {
    return this.newsRepository.save({ ...createNewsDto, createdAt: new Date().toISOString() } )
  }

  async findAll() {
    return this.newsRepository.find();
  }

  async findOne(id: number) {
    return this.newsRepository.findOne({ where: { id } });
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
