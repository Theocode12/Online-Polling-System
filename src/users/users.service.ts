import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordHashingService } from './password_hashing.service';
import { UpdatePasswordDto } from './dto/update_password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private passwordHashingService: PasswordHashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);
      user.password = await this.passwordHashingService.hashPassword(
        user.password,
      );
      return await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to create user');
    }
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email: email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      !(await this.passwordHashingService.comparePasswords(
        updatePasswordDto.oldPassword,
        user.password,
      ))
    ) {
      throw new ForbiddenException('Old password is incorrect');
    }
    const password = await this.passwordHashingService.hashPassword(
      updatePasswordDto.newPassword,
    );
    return await this.setAttribute(id, 'password', password);
  }

  async setAttribute(id: string, attribute: keyof User, value: any) {
    return this.usersRepository.update(id, { [attribute]: value });
  }

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }
}
