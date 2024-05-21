import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { UserProfileResponse } from './dto'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@Controller('user')
export class UserController {
    @UseGuards(AuthGuard('jwt'))
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
