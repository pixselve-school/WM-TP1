import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUser } from './dto/createUser.dto';
import { UpdateUser } from './dto/updateUser.dto';
import { UsersService } from './users.service';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  @ApiOkResponse({ description: 'All the users.' })
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ description: 'The user.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Get(':id')
  async getOneUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @ApiOkResponse({ description: 'The user.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Get(':id/roles')
  async getRoles(@Param('id') id: string): Promise<Role[]> {
    // execute function to check if user exists
    await this.usersService.findOne(+id);
    // return the roles
    return this.rolesService.getRolesForUser(+id);
  }

  @ApiOkResponse({ description: 'The user has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateOneUser(
    @Param('id') id: string,
    @Body() data: UpdateUser,
  ): Promise<User> {
    // check if the user exists
    const user = await this.usersService.findOne(parseInt(id));
    // if not, return error
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user);
    return this.usersService.update(user, data);
  }

  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteOneUser(@Param('id') id: string): Promise<User> {
    // check if the user exists
    const user = await this.usersService.findOne(parseInt(id));
    // if not, return error
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.delete(parseInt(id));
    return user;
  }

  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @Post()
  async create(
    @Body() { firstname, lastname, age, password }: CreateUser,
  ): Promise<User> {
    return this.usersService.create(firstname, lastname, age, password);
  }
}
