import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUser } from './createUser.dto';
import { UpdateUser } from './updateUser.dto';

let users: User[] = [
  {
    id: 0,
    lastname: 'Doe',
    firstname: 'John',
  },
];

@Controller('users')
export class UsersController {
  @Get()
  getAll(): User[] {
    return users;
  }

  @Get(':id')
  getOneUser(@Param('id') id: string): User {
    const user = users.find((value) => value.id === parseInt(id));
    if (user === undefined) {
      throw new NotFoundException();
    }
    return user;
  }

  @Put(':id')
  updateOneUser(@Param('id') id: string, @Body() data: UpdateUser): User {
    const user = users.find((value) => value.id === parseInt(id));
    if (user === undefined) {
      throw new NotFoundException();
    }
    if (data.lastname !== undefined) {
      user.lastname = data.lastname;
    }
    if (data.firstname !== undefined) {
      user.firstname = data.firstname;
    }
    return user;
  }

  @Delete(':id')
  deleteOneUser(@Param('id') id: string): User {
    const user = users.find((value) => value.id === parseInt(id));
    if (user === undefined) {
      throw new NotFoundException();
    }
    users = users.filter((value) => value.id !== parseInt(id));
    return user;
  }

  @Post()
  create(@Body() input: CreateUser): User {
    const user = new User(users.length, input.firstname, input.lastname);
    users.push(user);
    console.log(input);
    console.log(users);
    return user;
  }
}
