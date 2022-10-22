import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMinuteDto } from './dto/create-minute.dto';
import { UpdateMinuteDto } from './dto/update-minute.dto';
import { Repository } from 'typeorm';
import { Minute } from './entities/minute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AssociationsService } from '../associations/associations.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class MinutesService {
  constructor(
    @InjectRepository(Minute) private readonly repository: Repository<Minute>,
    private readonly associationsService: AssociationsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new minute.
   * @param createMinuteDto the minute to create
   * @returns the created minute
   * @throws {NotFoundException} if the association or the users does not exist
   */
  async create(createMinuteDto: CreateMinuteDto): Promise<Minute> {
    const [association, users] = await Promise.all([
      this.associationsService.findOne(createMinuteDto.idAssociation),
      this.usersService.findManyById(createMinuteDto.idVoters),
    ]);
    if (association === null) {
      throw new NotFoundException('Association not found');
    }
    if (users.length !== createMinuteDto.idVoters.length) {
      throw new NotFoundException('Some users not found');
    }

    const minute = new Minute();
    minute.content = createMinuteDto.content;
    minute.date = new Date(createMinuteDto.date);
    minute.association = association;
    minute.voters = users;
    return this.repository.save(minute);
  }

  findAll() {
    return `This action returns all minutes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} minute`;
  }

  update(id: number, updateMinuteDto: UpdateMinuteDto) {
    return `This action updates a #${id} minute`;
  }

  remove(id: number) {
    return `This action removes a #${id} minute`;
  }
}
