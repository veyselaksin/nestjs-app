import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { UserProfileResponse } from './dto'
import { Request } from 'express'
import { JwtAuthGuard } from '../auth/guard'
import { GetUser } from '../auth/decorator'
import { User } from '@prisma/client'

@Controller('user')
export class UserController {
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@GetUser() user: User): UserProfileResponse {
        console.log({ user: user })
        return {
            id: user.id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName
        }
    }
}
