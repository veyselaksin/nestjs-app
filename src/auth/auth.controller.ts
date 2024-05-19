import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterRequest, RegisterResponse } from './dto'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // add the register method here
    @Post('register')
    async register(@Body() request: RegisterRequest): Promise<RegisterResponse> {
        return this.authService.register(request)
    }
}
