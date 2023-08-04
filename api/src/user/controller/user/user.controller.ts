import { Body, Controller, Get, Post, forwardRef } from '@nestjs/common';
import { Observable, of, switchMap } from 'rxjs';
import { CreateUSerDTO } from '../../model/dto/create-user.dto';
import { UserService } from '../../service/user/user.service';
import { Injectable, Inject } from '@nestjs/common';
import { UserHeplerService } from '../../service/user-hepler/user-hepler.service';
import { UserI } from '../../model/user.interface';

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
    @Get() 
    findAll(){}


    @Post()
    login(){}
}
