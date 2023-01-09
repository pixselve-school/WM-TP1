import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUser } from './dto/createUser.dto';
import { UpdateUser } from './dto/updateUser.dto';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import { AssociationsService } from '../associations/associations.service';
import UserWithAssociationsDto from './dto/userWithAssociations.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => AssociationsService))
    private readonly associationsService: AssociationsService,
  ) {}

  private logger = new Logger('UsersController');

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
    return this.usersService.update(+id, data);
  }

  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiBadRequestResponse({ description: 'Can not delete yourself.' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteOneUser(@Param('id') id: string, @Request() req): Promise<User> {
    // check if logged user != user to delete
    if (req.user.username === +id) {
      throw new BadRequestException('You cannot delete yourself');
    }
    return this.usersService.delete(parseInt(id));
  }

  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @Post()
  async create(@Body() createUser: CreateUser): Promise<User> {
    const created = await this.usersService.create(createUser);
    try {
      await this.usersService.sendRegistrationConfirmationEmail(created);
    } catch (e) {
      this.logger.error("Couldn't send registration confirmation message");
    }

    return created;
  }
}
