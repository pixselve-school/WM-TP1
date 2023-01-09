import {Body, Controller, Post} from '@nestjs/common';
import {VerificationService} from "./verification.service";
import {Verification} from "./dto/Verification.dto";
import {ApiNotFoundResponse, ApiOkResponse} from "@nestjs/swagger";

@Controller('verification')
export class VerificationController {

    constructor(private readonly verificationService: VerificationService) {}

    @ApiOkResponse({ description: 'Empty Response.' })
    @ApiNotFoundResponse({ description: 'User not found.' })
    @Post()
    verifToken(@Body() verification: Verification) {
        return this.verificationService.verifToken(verification);
    }
}
