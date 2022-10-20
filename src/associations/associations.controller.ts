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
import Association from './association.entity';

@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Get()
  getAssociations() {
    return this.associationsService.getAssociations();
  }

  @Get(':id')
  getOneAssociation(@Param('id') id: string) {
    const idParsed = parseInt(id);
    const association = this.associationsService.getOneAssociation(idParsed);
    if (association === undefined) {
      throw new NotFoundException('Association not found');
    }
    return association;
  }

  @Delete(':id')
  deleteAssociation(@Param('id') id: string) {
    const idParsed = parseInt(id);
    if (this.associationsService.getOneAssociation(idParsed)) {
      return this.associationsService.deleteAssociation(idParsed);
    } else {
      throw new NotFoundException('Association not found');
    }
  }

  @Put(':id')
  updateAssociation(@Param('id') id: string, @Body() data: UpdateAssociation) {
    const idParsed = parseInt(id);
    const association = this.associationsService.getOneAssociation(idParsed);
    if (association === undefined) {
      throw new NotFoundException('Association not found');
    }
    if (data.idUsers !== undefined) {
      association.idUsers = data.idUsers;
    }
    if (data.name !== undefined) {
      association.name = data.name;
    }
    return this.associationsService.updateAssociation(idParsed, association);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    const idParsed = parseInt(id);
    const members = this.associationsService.getMembers(idParsed);
    if (members === null) {
      throw new NotFoundException('Association not found');
    }
    return members;
  }

  @Post()
  createAssociation(@Body() { name, idUsers }: CreateAssociation) {
    return this.associationsService.createAssociation(name, idUsers);
  }
}
