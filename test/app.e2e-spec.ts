import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum'
import { first } from 'rxjs'

describe('App e2e test', () => {
    let app: INestApplication
    let prismaService: PrismaService
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleRef.createNestApplication()
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true
            })
        )

        await app.init()
        await app.listen(3001)

        prismaService = moduleRef.get<PrismaService>(PrismaService)
        await prismaService.cleanDB()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('Auth', () => {
        describe('Register', () => {
            it('should register a new user', async () => {
                await pactum
                    .spec()
                    .post('http://localhost:3001/auth/register')
                    .withBody({
                        email: 'veysel.aksin@test.com',
                        password: 'password',
                        firstName: 'Veysel',
                        lastName: 'Aksin'
                    })
                    .expectStatus(201)
                    .inspect()
            })

            it('should not register a user with the same email', async () => {
                await pactum
                    .spec()
                    .post('http://localhost:3001/auth/register')
                    .withBody({
                        email: 'veysel.aksin@test.com',
                        password: 'password',
                        firstName: 'Veysel',
                        lastName: 'Aksin'
                    })
                    .expectStatus(409)
            })

            it('should not register a user with an invalid email', async () => {
                await pactum
                    .spec()
                    .post('http://localhost:3001/auth/register')
                    .withBody({
                        email: 'veysel.aksin',
                        password: 'password',
                        firstName: 'Veysel',
                        lastName: 'Aksin'
                    })
                    .expectStatus(400)
            })
        })

        describe('Login', () => {
            it('should login the user', async () => {
                await pactum
                    .spec()
                    .post('http://localhost:3001/auth/login')
                    .withBody({
                        email: 'veysel.aksin@test.com',
                        password: 'password'
                    })
                    .expectStatus(200)
                    .stores('access_token', 'body.access_token')
                    .inspect()
            })
        })

        // describe('User', () => {
        //     console.log('access_token $S{access_token}')
        //     describe('User Profile', () => {
        //         it('should get the user profile', async () => {
        //             await pactum
        //                 .spec()
        //                 .get('http://localhost:3001/user/profile')
        //                 .withHeaders({
        //                     Authorization: 'Bearer $S{access_token}'
        //                 })
        //                 .expectStatus(200)
        //                 .inspect()
        //         })
        //     })
        // })
    })

    it.todo('should pass the e2e test')
})
