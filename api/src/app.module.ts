  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import { ConfigModule } from '@nestjs/config';
  import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
  import * as path from 'path';
  import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
   import { AuthMiddleware } from './middleware/auth.middleware';  // Use lowercase 'auth.middleware'
  @Module({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'mysql', // Update this line
        username: 'root',
        // url: process.env.DATABASE_URL, // Comment out or remove this line
        database: 'chat',
        password: 'ahmed', // Replace with the actual password if required
        autoLoadEntities: true,
        entities: [path.join(process.cwd(),'dist/**/*.entity.js')],
        synchronize: true,
      }),
      UserModule,
      AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule  implements NestModule  {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware)
        .exclude(
          { path: '/api/user', method: RequestMethod.POST},
          {path: '/api/user/login', method: RequestMethod.POST}
        )
        .forRoutes('')
    }
  
}
