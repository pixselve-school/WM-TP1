import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  lastname: string;
  @Column()
  firstname: string;
  @Column()
  age: number;

  @Column()
  @Exclude()
  password: string;
}
