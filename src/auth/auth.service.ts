import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    id: number,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userService.findOne(id);
    if (!user) return undefined;
    if (await bcrypt.compare(password, user.password)) return user;
    return undefined;
  }

  async login(user: User) {
    const payload = { username: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
