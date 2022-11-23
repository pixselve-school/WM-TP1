import { AssociationMember } from './association.member';
import Association from '../entities/association.entity';
import { Role } from '../../roles/entities/role.entity';

export default class AssociationDto {
  id: number;
  public name: string;
  public members: AssociationMember[];

  public from(association: Association, roles: Role[]): AssociationDto {
    this.name = association.name;
    this.id = association.id;
    this.members = association.users.map((userInfo) => {
      const role = roles.find(
        (value) =>
          value.userId === userInfo.id &&
          value.associationId === association.id,
      );
      return new AssociationMember().from(userInfo, role);
    });
    return this;
  }
}
