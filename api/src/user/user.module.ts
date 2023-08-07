import { Module } from '@nestjs/common';
import { UserController } from './controller/user/user.controller';
import { UserService } from './service/user/user.service';
import { TypeOrmModule} from '@nestjs/typeorm'
import { UserEntity } from './model/user.entity';
import { UserHeplerService } from './service/user-hepler/user-hepler.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]) , 
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService , UserHeplerService],
  exports: [UserService]
})
export class UserModule {}
