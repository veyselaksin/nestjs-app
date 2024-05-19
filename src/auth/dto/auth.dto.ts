import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator'

export class RegisterRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string
}

export class RegisterResponse {
    @IsNumber()
    fullName: string

    email: string
}
