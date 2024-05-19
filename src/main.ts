import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'node:process'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true
        })
    )
    // port from env
    await app.listen(process.env.APP_PORT)
}

bootstrap()
