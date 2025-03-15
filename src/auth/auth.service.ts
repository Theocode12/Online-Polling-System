import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { PasswordHashingService } from 'src/users/password_hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordHashingService: PasswordHashingService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User | null = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = await this.passwordHashingService.comparePasswords(
      password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDto) {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const newUser = await this.usersService.create(user);
    return this.login(newUser);
  }
}
