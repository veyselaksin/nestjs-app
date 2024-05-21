import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './dto'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // add the register method here
    @Post('register')
    async register(@Body() request: RegisterRequest): Promise<RegisterResponse> {
        return this.authService.register(request)
    }

    @Post('login')
    async login(@Body() request: LoginRequest): Promise<LoginResponse> {
        return this.authService.login(request)
    }
}
