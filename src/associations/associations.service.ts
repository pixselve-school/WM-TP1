import { Injectable } from '@nestjs/common';
import Association from './association.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AssociationsService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<Association>,
    private readonly service: UsersService,
  ) {}

  async getAssociations(): Promise<Association[]> {
    return this.repository.find();
  }

  async deleteAssociation(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  async getOneAssociation(id: number): Promise<Association> {
    return this.repository.findOneBy({ id });
  }

  async updateAssociation(id: number, association: Association): Promise<void> {
    await this.repository.update({ id }, association);
  }

  async getMembers(id: number): Promise<User[]> {
    return this.repository.findOneBy({ id }).then((value) => value.users);
  }

  async createAssociation(
    name: string,
    idUsers: number[],
  ): Promise<Association> {
    const users = await this.service.findManyById(idUsers);
    return this.repository.create({ name, users });
  }
}
