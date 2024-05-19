import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as argon from 'argon2'
import { RegisterRequest, RegisterResponse } from './dto'

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {}

    // Register response
    async register(request: RegisterRequest): Promise<RegisterResponse> {
        // generate the password hash
        const hash: string = await argon.hash(request.password)

        // create the user
        const user = await this.prismaService.user.create({
            data: {
                email: request.email,
                password: hash,
                firstName: request.firstName,
                lastName: request.lastName
            }
        })

        // return the user
        return {
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`
        }
    }
}
