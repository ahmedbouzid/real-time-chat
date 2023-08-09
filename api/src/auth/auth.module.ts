import { Module } from '@nestjs/common';
import { AuthService } from './service/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports : [
    JwtModule.registerAsync({
      imports : [ConfigModule],
      inject: [ConfigService] , 
      useFactory : async(configService : ConfigService) => ({
        secret : configService.get('JWT_SECRET') ,
        signOptions: {expiresIn : '10000s'}
      })
    })
  ],
  providers: [AuthService , JwtStrategy , JwtStrategy] , 
  exports : [AuthService]
})
export class AuthModule {}
