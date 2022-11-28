import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'The name of the event',
    example: "Romain's birthday",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The start date of the event',
    example: '2021-01-01T00:00:00.000Z',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    description: 'The end date of the event',
    example: '2021-01-01T00:00:00.000Z',
    type: Date,
  })
  end: Date;

  @ApiProperty({
    description: 'The association id of the event',
    example: 1,
    type: Number,
  })
  association: number;
}
