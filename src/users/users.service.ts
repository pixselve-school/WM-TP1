import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUser } from './updateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.repository.create({
      age,
      lastname,
      firstname,
      password: hashedPassword,
    });
    await this.repository.insert(user);
    return user;
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
  async findOne(userId: number): Promise<User | null> {
    return this.repository.findOneBy({ id: userId });
  }

  /**
   * Update user details (first name or last name).
   * @param user the user
   * @param data the data to update
   */
  async update(user: User, data: UpdateUser): Promise<User> {
    if (data.password !== undefined) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const updatedUser = this.repository.merge(user, data);
    await this.repository.save(updatedUser);
    return updatedUser;
  }

  /**
   * Find many users by their ids.
   * @param ids the ids
   * @returns the users found or an empty array if none found
   */
  async findManyById(ids: number[]): Promise<User[]> {
    return this.repository.findBy({ id: In(ids) });
  }
}
