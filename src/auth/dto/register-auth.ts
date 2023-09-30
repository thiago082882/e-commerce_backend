import {IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class RegisterUserDto{

    @IsNotEmpty()
    @IsString()
    name :string;

    @IsNotEmpty()
    @IsString()
    lastname : string; 

    @IsNotEmpty()
    @IsString()
    @IsEmail({},{message:'O email não é válido'})
    email : string;

    @IsNotEmpty()
    @IsString()
    phone : string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6,{message:'A senha deverá ter pelo menos 6 caracteres'})
    password: string;

    rolesIds : string[];

}