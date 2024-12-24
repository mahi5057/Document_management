import { IsOptional, IsString, IsEmail } from 'class-validator';
import { Role } from 'src/enums/roles.enum';

export class UpdateUserDto {
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    roles?: Role[];
}
