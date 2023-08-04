import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, switchMap } from 'rxjs';
import { UserEntity } from '../../model/user.entity';
import { UserI } from '../../model/user.interface';
import { Repository } from 'typeorm';

const bcrypt = require('bcrypt')

@Injectable()
export class UserService {


    constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo :Repository<UserEntity>
    ){}

    create (newUser : UserI) :Observable<UserI> {
        return  this.mailExiste(newUser.email).pipe(
            switchMap((exists : boolean)=> {
                if(exists === false ) {
                    return this.hashPassword(newUser.password).pipe (
                        switchMap((passwordHash : string)=> {
                            newUser.password = passwordHash ;

                            return from (this.userRepo.save(newUser)).pipe(
                                switchMap((user : UserI) => this.findOne(user.id))
                            )
                        })
                    )
                } else {
                    throw new HttpException ('Email is Already in use ' , HttpStatus.CONFLICT)
                }
            })
        )
    }


      mailExiste(email : string) : Observable<boolean> {

        return from(this.userRepo.findOne({where :{email}})).pipe(
            map((user : UserI) => {
                return user ? true : false
            })
        )

        
    }

      hashPassword(password : string ): Observable<string>{

        return from<string>(bcrypt.hash(password , 12))
    }

     findOne(id:number ) : Observable <UserI> {
        return from(this.userRepo.findOne( {where :{id}}))
    }
}
