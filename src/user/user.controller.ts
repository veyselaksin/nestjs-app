import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { UserProfileResponse } from './dto'
import { Request } from 'express'
import { JwtAuthGuard } from '../auth/guard'

@Controller('user')
export class UserController {
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() request: Request): UserProfileResponse {
        console.log({ user: request.user })
        return {
            id: request.user['id'],
            email: request.user['email'],
            fullName: `${request.user['firstName']} ${request.user['lastName']}`,
            firstName: request.user['firstName'],
            lastName: request.user['lastName']
        }
    }
}
