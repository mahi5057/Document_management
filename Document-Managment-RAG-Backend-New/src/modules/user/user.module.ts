import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user/user.controller';
import { User } from 'src/entities/user.entity';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';
import { UserService } from 'src/services/user/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, JwtService, JwtStrategy],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule { }
