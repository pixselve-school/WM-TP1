import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Verification {
    @ApiProperty({
        description: 'The email token to verify',
        example: "aSe4xDS4r45AS1cWd",
        type: String,
    })
    @IsNotEmpty()
    token: string;
}
