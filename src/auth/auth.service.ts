import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as argon from 'argon2'
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    // Register response
    async register(request: RegisterRequest): Promise<RegisterResponse> {
        try {
            // generate the password hash
            const hash: string = await argon.hash(request.password)

            // create the user
            const user: User = await this.prismaService.user.create({
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
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Email already exists')
                }
            }
            console.log('Error: ', error)
            throw error
        }
    }

    async login(request: LoginRequest): Promise<LoginResponse> {
        // find the user by email
        const user: User = await this.prismaService.user.findUnique({
            where: {
                email: request.email
            }
        })

        // if the user is not found, throw an error
        if (!user) {
            throw new NotFoundException('User not found')
        }

        // verify the password
        const isValid: boolean = await argon.verify(user.password, request.password)

        // if the password is invalid, throw an error
        if (!isValid) {
            // Password is invalid exception
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED)
        }

        // return the access token
        return {
            accessToken: this.jwtToken(user)
        }
    }

    jwtToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`
        }
        return this.jwtService.sign(payload, {
            expiresIn: '1h',
            secret: this.configService.get('JWT_SECRET')
        })
    }
}
