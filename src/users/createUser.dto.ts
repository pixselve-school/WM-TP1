import { ApiProperty } from '@nestjs/swagger';

export class CreateUser {
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    type: String,
  })
  lastname: string;
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    type: String,
  })
  firstname: string;
  @ApiProperty({
    description: 'The age of the user',
    example: 42,
    type: Number,
  })
  age: number;
}
