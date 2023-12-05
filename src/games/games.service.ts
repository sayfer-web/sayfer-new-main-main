import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {

  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>
  ) {}

  async create(createGameDto: CreateGameDto) {

    const { title, content } = createGameDto

    // console.log(title, content)

    // const newGame = {
    //   title,
    //   content,
    //   coverImages: 'https://mf.b37mrtl.ru/russian/images/2021.02/article/6021516402e8bd579344a968.jpg',
    //   createdAt: new Date()
    // }

    return await this.gamesRepository.save({ 
      content: createGameDto.content, 
      title: createGameDto.title, 
      coverImages: 'https://mf.b37mrtl.ru/russian/images/2021.02/article/6021516402e8bd579344a968.jpg',
      createdAt: new Date().toISOString()
    })
  }

  async findAll() {
    return await this.gamesRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
