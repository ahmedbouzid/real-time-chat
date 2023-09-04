import { Body, Controller, Get, Post, Query, forwardRef , UseGuards  } from '@nestjs/common';
import { Observable, map, of, switchMap } from 'rxjs';
import { CreateUSerDTO } from '../../model/dto/create-user.dto';
import { UserService } from '../../service/user/user.service';
import { Injectable, Inject } from '@nestjs/common';
import { UserHeplerService } from '../../service/user-hepler/user-hepler.service';
import { UserI } from '../../model/user.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDTO } from 'src/user/model/dto/login-user.dto';
import { LoginResponseI } from 'src/user/model/dto/login-response.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
export class UserController {


    constructor(
        @Inject(forwardRef(() => UserService))   private usersService: UserService,
        @Inject(forwardRef(() => UserHeplerService))  private userHelperService : UserHeplerService
    ){}
    @Post()
   async create(@Body() createUserDTO : CreateUSerDTO):Promise<UserI> {
    const userEntity :UserI = this.userHelperService.createUserDTOToEntity(createUserDTO) ;
    return this.usersService.create(userEntity)

    }


    @UseGuards(JwtAuthGuard)
    @Get()
    async  findAll(
      
        @Query('page') page:number ,
        @Query ('limit') limit : number = 20
    ) : Promise<Pagination<UserI>> {
        limit = limit > 100 ? 100 : limit ;
        return this.usersService.findAll({page , limit , route:'http://localhost:3000/api/user'})
        
    }
@Get('/find-by-username')
async findAllByUsername(@Query('username') username : string) {
  return this.usersService.findAllByUsername(username) ;

}
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDTO): Promise<LoginResponseI> {
      const userEntity : UserI = this.userHelperService.loginUserDTO(loginUserDto) ;
      const jwt : string = await this.usersService.login(userEntity) ;
      return {
        accesToken : jwt ,
        tokenType : 'JWT' ,
        expiresIn : 100000
      }

    }
}
