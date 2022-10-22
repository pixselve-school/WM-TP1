import { User } from '../../users/user.entity';
import Association from '../../associations/association.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Role {
  @Column()
  name: string;

  @OneToOne(() => User, {createForeignKeyConstraints: false})
  @JoinColumn({ name: 'userId' })
  user: User;

  @PrimaryColumn({ unique: false })
  userId: number;

  @PrimaryColumn({ unique: false })
  associationId: number;

  @OneToOne(() => Association, {createForeignKeyConstraints: false})
  @JoinColumn({ name: 'associationId' })
  association: Association;
}
