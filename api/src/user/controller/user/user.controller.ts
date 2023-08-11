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
    create(@Body() createUserDTO : CreateUSerDTO):Observable<UserI> {
       return  this.userHelperService.createUserDTOToEntity(createUserDTO).pipe(
            switchMap((user : UserI) => this.usersService.create(user))
         )
    }


    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(
      
        @Query('page') page:number ,
        @Query ('limit') limit : number = 20
    ) : Observable<Pagination<UserI>> {
        limit = limit > 100 ? 100 : limit ;
        return this.usersService.findAll({page , limit , route:'http://localhost:3000/api/user'})
        
    }


    @Post('login')
    login(@Body() loginUserDto: LoginUserDTO): Observable<LoginResponseI> {
      return this.userHelperService.loginUserDTO(loginUserDto).pipe(
        switchMap((user: UserI) => this.usersService.login(user).pipe (
          map((jwt : string)=> {
            return {
              accesToken : jwt ,
              tokenType : 'JWT' ,
              expiresIn : 100000
            }
          
          })
        ))
      )
    }
}
