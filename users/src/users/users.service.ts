import * as bcrypt from 'bcryptjs';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from './models/users.model';
import { ERROR_MESSAGES } from '../constants';
import { CreateUserDto } from './dto/create-user.dto';
import * as process from 'process';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: typeof User,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const candidate = await this.findByEmail(dto.email);
    if (candidate) {
      throw new BadRequestException(ERROR_MESSAGES.EMAIL_IS_BUSY);
    }
    const hashPassword = await bcrypt.hash(dto.password, 5);
    await this.usersRepository.create({
      ...dto,
      password: hashPassword,
    });
    const newUser = await this.findByEmail(dto.email);
    await this.fetchLog(this.getLog('create', newUser.id));
    return newUser;
  }

  async deleteUser(id: number) {
    const user = await this.getUserById(id);
    if (!user) throw new BadRequestException(ERROR_MESSAGES.NO_USER_EXISTS);
    return await this.usersRepository.destroy({ where: { id } });
  }

  async getAll(): Promise<User[]> {
    return this.usersRepository.findAll({ order: [['id', 'DESC']] });
  }

  async updateUser(id: string, newUser: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    await this.fetchLog(this.getLog('update', Number(id)));
    return user && user.update(newUser);
  }

  async getUserById(id: number): Promise<Partial<User>> {
    return await this.usersRepository.findByPk(id);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  private async fetchLog(data): Promise<string> {
    try {
      const res = await fetch(`${process.env.LOG_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data),
      });
      return res.statusText;
    } catch (error) {
      console.log(error);
    }
  }

  private getLog(method: string, id: number) {
    return {
      userId: id,
      method,
      date: new Date(),
    };
  }
}
