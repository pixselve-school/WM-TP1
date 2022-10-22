import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUser {
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    type: String,
  })
  @IsNotEmpty()
  lastname: string;
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    type: String,
  })
  @IsNotEmpty()
  firstname: string;
  @ApiProperty({
    description: 'The age of the user',
    example: 42,
    type: Number,
    minimum: 0,
  })
  @IsNotEmpty()
  age: number;
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
    type: String,
  })
  @IsNotEmpty()
  password: string;
}
