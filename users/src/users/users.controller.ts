import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/users.model';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post('/')
  async createUser(@Body() dto: CreateUserDto) {
    return await this.usersService.createUser(dto);
  }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: User })
  @Get('/')
  async getAllUsers() {
    return await this.usersService.getAll();
  }

  @ApiOperation({ summary: 'Изменение пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Patch('/:id')
  update(@Param('id') id: string, @Body() user: CreateUserDto) {
    return this.usersService.updateUser(id, user);
  }
}
