import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUser } from './updateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  /**
   * Create a new user.
   * @param firstname
   * @param lastname
   * @param age the age
   */
  async create(
    firstname: string,
    lastname: string,
    age: number,
  ): Promise<User> {
    return this.repository.create({ age, lastname, firstname });
  }

  /**
   * Delete the user with the given user id.
   * @param userId the user id
   */
  async delete(userId: number): Promise<void> {
    await this.repository.delete({ id: userId });
  }

  /**
   * Get all the users.
   */
  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  /**
   * Find one user by id.
   * @param userId the user id
   */
  async findOneById(userId: number): Promise<User | null> {
    return this.repository.findOneBy({ id: userId });
  }

  /**
   * Update user details (first name or last name).
   * @param id the user id
   * @param data the data to update
   */
  async update(id: number, data: UpdateUser) {
    await this.repository.update({ id }, data);
  }

  async findManyById(ids: number[]): Promise<User[]> {
    return this.repository.findBy({ id: In(ids) });
  }
}
