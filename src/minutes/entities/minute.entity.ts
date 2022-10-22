import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Association from '../../associations/association.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Minute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  date: Date;

  @ManyToOne(() => Association)
  @JoinTable()
  association: Association;

  @ManyToMany(() => User)
  @JoinTable()
  voters: User[];
}
