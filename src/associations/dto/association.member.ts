import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

export class AssociationMember {
  public lastname: string;
  public firstname: string;
  public age: number;
  public role: string;
  public id: number;

  from(user: User, role: Role): AssociationMember {
    this.lastname = user.lastname;
    this.firstname = user.firstname;
    this.age = user.age;
    this.role = role ? role.name : 'member';
    this.id = user.id;
    return this;
  }
}
