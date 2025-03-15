import { IsAlphanumeric, IsEmail, IsLowercase, IsNotEmpty, IsUppercase, MaxLength, MinLength, ValidateIf } from "class-validator";

export abstract class AbstractUserDto
{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(32, { message: 'Password must not exceed 32 characters' })
    @ValidateIf((o: AbstractUserDto) => /[^A-Za-z0-9]/.test(o.password), {
    message: 'Password must contain at least one special character',
    })
    @IsUppercase({
    message: 'Password must contain at least one uppercase letter',
    })
    @IsLowercase({
    message: 'Password must contain at least one lowercase letter',
    })
    password: string;
}