import { Injectable } from '@nestjs/common/decorators';
import { CreateUSerDTO } from '../../model/dto/create-user.dto';
import { LoginUserDTO } from '../../model/dto/login-user.dto';
import { UserI } from '../../model/user.interface';

@Injectable()
export class UserHeplerService {


    createUserDTOToEntity(createUserDto : CreateUSerDTO):UserI{

        return {
            email:createUserDto.email ,
            username:createUserDto.username ,
            password : createUserDto.password
        }

    }
    loginUserDTO(loginUserDTO : LoginUserDTO) : UserI{
        return {
            email: loginUserDTO.email ,
            password : loginUserDTO.password ,
        }
    }
}
