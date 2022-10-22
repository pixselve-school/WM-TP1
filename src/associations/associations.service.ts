import { Injectable } from '@nestjs/common';
import Association from './association.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class AssociationsService {
  constructor(
    @InjectRepository(Association)
    private readonly repository: Repository<Association>,
    private readonly userService: UsersService,
  ) {}

  async getAssociations(): Promise<Association[]> {
    return this.repository.find();
  }

  async deleteAssociation(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  async findOne(id: number): Promise<Association> {
    return this.repository.findOneBy({ id });
  }

  async updateAssociation(id: number, association: Association): Promise<void> {
    await this.repository.update({ id }, association);
  }

  async getMembers(id: number): Promise<User[]> {
    return this.repository
      .findOneBy({ id })
      .then((value) => value?.users ?? []);
  }

  async createAssociation(
    name: string,
    idUsers: number[],
  ): Promise<Association> {
    const users = await this.userService.findManyById(idUsers);

    const result = new Association();
    result.name = name;
    result.users = users;

    await this.repository.insert(result);
    return result;
  }
}
