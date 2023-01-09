import { Injectable } from '@nestjs/common';
import {Verification} from "./dto/Verification.dto";
import {UsersService} from "../users/users.service";

@Injectable()
export class VerificationService {

    constructor(
        private readonly userService: UsersService,
    ) {}
    async verifToken(verification: Verification) {
        const res = await this.userService.verifyUser(verification.token);
        return res;
    }
}
