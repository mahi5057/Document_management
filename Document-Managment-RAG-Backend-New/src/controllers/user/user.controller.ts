import { Controller, Post, Body, Request, UseGuards, Get, Param, Patch, Delete, BadRequestException, Put, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongodb';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { Role } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService, private jwtService: JwtService) { }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  findAllUsers() {
    return this.userService.findAll();
  }

  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async updateUser(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto, 
    @Request() req
  ): Promise<any> {
    const userId = new ObjectId(id); 
    const updateData = {
      name: updateUserDto.name,
      email: updateUserDto.email,
      roles: updateUserDto.roles,
    };

    const updateResult = await this.userService.updateUser(userId, updateData);
    if (!updateResult) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User updated successfully' };
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!id || !ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid User ID');
    }

    return this.userService.remove(id, userId);
  }

  @Post('delete')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async removeMultiple(@Body() ids: string[], @Request() req) {
    for (const id of ids) {
      if (!ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid document ID: ${id}`);
      }
    }

    return this.userService.deleteUsers(ids);
  }
}
