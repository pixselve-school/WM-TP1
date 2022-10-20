import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUser } from './updateUser.dto';

@Injectable()
export class UsersService {
  users: User[] = [
    {
      id: 0,
      lastname: 'Doe',
      firstname: 'John',
      age: 23,
    },
  ];

  /**
   * Create a new user.
   * @param firstName the first name
   * @param lastName the last name
   * @param age the age
   */
  create(firstName: string, lastName: string, age: number) {
    const user = new User(this.users.length, firstName, lastName, age);
    this.users.push(user);
    return user;
  }

  /**
   * Delete the user with the given user id.
   * @param userId the user id
   */
  delete(userId: number) {
    this.users = this.users.filter((user) => user.id !== userId);
  }

  /**
   * Get all the users.
   */
  findAll() {
    return this.users;
  }

  /**
   * Find one user by id.
   * @param userId the user id
   */
  findOneById(userId: number) {
    return this.users.find((user) => user.id === userId);
  }

  /**
   * Update user details (first name or last name).
   * @param id the user id
   * @param data the data to update
   */
  update(id: number, data: UpdateUser) {
    const user = this.findOneById(id);
    if (data.firstname) {
      user.firstname = data.lastname;
    }
    if (data.lastname) {
      user.lastname = data.lastname;
    }
    return user;
  }
}
