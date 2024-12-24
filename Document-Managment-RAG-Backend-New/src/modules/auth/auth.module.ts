import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';
import { AuthController } from 'src/controllers/auth/auth.controller';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            global: true,
            secret: 'secret',
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthService, JwtStrategy, JwtService],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }
