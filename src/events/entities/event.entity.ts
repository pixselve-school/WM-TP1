import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Association from '../../associations/entities/association.entity';

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  @ManyToOne(() => Association, (object) => object.id)
  association: Association;
}
