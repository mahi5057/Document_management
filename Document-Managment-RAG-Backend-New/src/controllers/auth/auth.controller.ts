import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { SignupDto } from 'src/dto/signup.dto';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService, private authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() body: SignupDto) {
        return this.userService.register(body.username, body.name, body.email, body.password);
    }

    @Post('login')
    async login(@Body() body: LoginDto) {
        const user: User = await this.userService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user.username, user.id, user.roles);
    }

    @Post('validate-token')
    validateToken(@Body('token') token: string) {
        return this.authService.validateToken(token);
    }
}
