import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AssociationsService } from './associations.service';
import UpdateAssociation from './updateAssociation.dto';
import CreateAssociation from './createAssociation.dto';
import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('associations')
@Controller('associations')
export class AssociationsController {
  constructor(
    private readonly associationsService: AssociationsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getAssociations() {
    return this.associationsService.getAssociations();
  }

  @Get(':id')
  async getOneAssociation(@Param('id') id: string) {
    const idParsed = parseInt(id);
    const association = this.associationsService.getOneAssociation(idParsed);
    if (association === undefined) {
      throw new NotFoundException('Association not found');
    }
    return association;
  }

  @Delete(':id')
  async deleteAssociation(@Param('id') id: string) {
    const idParsed = parseInt(id);
    if (await this.associationsService.getOneAssociation(idParsed)) {
      return this.associationsService.deleteAssociation(idParsed);
    } else {
      throw new NotFoundException('Association not found');
    }
  }

  @Put(':id')
  async updateAssociation(
    @Param('id') id: string,
    @Body() data: UpdateAssociation,
  ) {
    const idParsed = parseInt(id);
    const association = await this.associationsService.getOneAssociation(
      idParsed,
    );
    if (association === undefined) {
      throw new NotFoundException('Association not found');
    }
    if (data.idUsers !== undefined) {
      const users = await this.usersService.findManyById(data.idUsers);
      association.users = users;
    }
    if (data.name !== undefined) {
      association.name = data.name;
    }
    return this.associationsService.updateAssociation(idParsed, association);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    const idParsed = parseInt(id);
    const members = this.associationsService.getMembers(idParsed);
    if (members === null) {
      throw new NotFoundException('Association not found');
    }
    return members;
  }

  @Post()
  async createAssociation(@Body() { name, idUsers }: CreateAssociation) {
    return this.associationsService.createAssociation(name, idUsers);
  }
}
