import { Injectable } from '@nestjs/common/decorators';
import { Observable, of } from 'rxjs';
import { CreateUSerDTO } from '../../model/dto/create-user.dto';
import { LoginUserDTO } from '../../model/dto/login-user.dto';
import { UserI } from '../../model/user.interface';

@Injectable()
export class UserHeplerService {


    createUserDTOToEntity(createUserDto : CreateUSerDTO):Observable<UserI>{

        return of({
            email:createUserDto.email ,
            username:createUserDto.username ,
            password : createUserDto.password
        })

    }
    loginUserDTO(loginUserDTO : LoginUserDTO) : Observable<UserI>{
        return of({
            email: loginUserDTO.email ,
            password : loginUserDTO.password ,
        })
    }
}
