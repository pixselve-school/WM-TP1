import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
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

  @Column()
  @Exclude()
  verified: boolean;

  @Column({ unique: true })
  @Exclude()
  verificationToken: string;
}
