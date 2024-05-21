import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class RegisterRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string
}

export class RegisterResponse {
    fullName: string

    email: string
}

export class LoginRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export class LoginResponse {
    accessToken: string
}
