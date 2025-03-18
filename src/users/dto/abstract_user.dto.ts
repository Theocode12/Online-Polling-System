import { IsEmail, IsStrongPassword } from "class-validator";

export abstract class AbstractUserDto
{
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}