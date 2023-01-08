import { User } from '../../users/entities/user.entity';
import Association from '../../associations/entities/association.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Role {
  @Column()
  name: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @PrimaryColumn({ unique: false })
  userId: number;

  @PrimaryColumn({ unique: false })
  associationId: number;

  @OneToOne(() => Association)
  @JoinColumn({ name: 'associationId' })
  association: Association;
}
