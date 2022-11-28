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
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { AssociationsService } from '../associations/associations.service';
import UserWithAssociationsDto from './dto/userWithAssociations.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
    @Inject('MAIL_SERVICE') private client: ClientProxy,
    @Inject(forwardRef(() => AssociationsService))
    private readonly associationsService: AssociationsService,
  ) {}

  @ApiOkResponse({ description: 'All the users.' })
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ description: 'The user.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Get(':id')
  async getOneUser(@Param('id') id: string): Promise<UserWithAssociationsDto> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // get associations
    const associations = await this.associationsService.getAssociationsForUser(
      parseInt(id),
    );
    // return the user with associations
    return new UserWithAssociationsDto().from(user, associations);
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
  async create(@Body() createUser: CreateUser): Promise<User> {
    const created = await this.usersService.create(createUser);
    try {
      await this.client
        .emit(
          'mail',
          new RmqRecordBuilder({
            firstName: createUser.firstname,
            lastName: createUser.lastname,
            email: 'mael.kerichard@etudiant.univ-rennes1.fr',
          })
            .setOptions({
              contentType: 'application/json',
            })
            .build(),
        )
        .toPromise();
    } catch (e) {
      console.log(e);
    }

    return created;
  }
}
