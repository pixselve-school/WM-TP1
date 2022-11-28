import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateUser } from './dto/updateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUser } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  /**
   * Create a new user.
   * @param createUserData the data to create the user
   */
  async create(createUserData: CreateUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserData.password, 10);
    const user = User.create();
    user.firstname = createUserData.firstname;
    user.lastname = createUserData.lastname;
    user.age = createUserData.age;
    user.email = createUserData.email;
    user.password = hashedPassword;
    return this.repository.save(user);
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
   * @returns the user found
   * @throws {NotFoundException} if the user is not found
   */
  async findOne(userId: number): Promise<User | null> {
    const user = await this.repository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
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
