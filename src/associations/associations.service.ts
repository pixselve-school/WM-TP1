import { Injectable } from '@nestjs/common';
import Association from './association.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AssociationsService {
  constructor(private readonly service: UsersService) {}

  private associations: Association[] = [
    {
      id: 0,
      name: 'Association 1',
      idUsers: [0],
    },
  ];

  getAssociations(): Association[] {
    return this.associations;
  }

  deleteAssociation(id: number): Association {
    const association = this.associations.find(
      (association) => association.id === id,
    );
    this.associations = this.associations.filter(
      (association) => association.id !== id,
    );
    return association;
  }

  getOneAssociation(id: number): Association {
    return this.associations.find((association) => association.id === id);
  }

  updateAssociation(id: number, association: Association): Association {
    const index = this.associations.findIndex(
      (association) => association.id === id,
    );
    this.associations[index] = association;
    return this.associations[index];
  }

  getMembers(id: number): User[] | null {
    const association = this.getOneAssociation(id);
    if (association === undefined) {
      return null;
    }
    const members = association.idUsers.map((id) =>
      this.service.findOneById(id),
    );
    return members;
  }

  createAssociation(name: string, idUsers: number[]): Association {
    const id = this.associations.length;
    const association = {
      id,
      name,
      idUsers,
    };
    this.associations.push(association);
    return association;
  }
}
