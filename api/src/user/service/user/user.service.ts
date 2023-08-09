import { Get, HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, mapTo, switchMap } from 'rxjs';
import { UserEntity } from '../../model/user.entity';
import { UserI } from '../../model/user.interface';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth/auth.service';


const bcrypt = require('bcrypt')

@Injectable()
export class UserService {


    constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo :Repository<UserEntity> , 
    private readonly authService  : AuthService
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

    

     findOne(id:number ) : Observable <UserI> {
        return from(this.userRepo.findOne( {where :{id}}))
    }
    findAll( options :  IPaginationOptions) : Observable<Pagination<UserI>>{
        return from(paginate<UserEntity>(this.userRepo , options))
    }

    /// change to jwt
    login(user:UserI) : Observable<string> {
        return this.findByEmail(user.email).pipe (
            switchMap((foundUser : UserI )=> {
                if (foundUser) {
                    return this.validatePassword(user.password , foundUser.password).pipe(
                        switchMap((matches : boolean)=> {
                            if (matches) {
                                return this.findOne(foundUser.id).pipe(
                                  switchMap((payload : UserI)=> this.authService.generateJwt(payload))  
                                )
                            } else {
                                throw new HttpException('Login was not succufully , wrong cridential' , HttpStatus.UNAUTHORIZED)
                            }
                        })
                    )
                } else {
                    throw new HttpException ('User not Found' , HttpStatus.NOT_FOUND)
                }
            })
        )

    }

     findByEmail (email : string) : Observable<UserI> {

        return from (this.userRepo.findOne({where :{email } , select : ['id' , 'email','username','password']}))
    }
    validatePassword(password: string, storedPasswordHash: string): Observable<any> {
        try {
            return this.authService.comparePAssword(password ,storedPasswordHash)
        } catch (error) {
            console.error('Password validation error:', error);
            throw new HttpException('Password validation failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    hashPassword(password : string ): Observable<string>{
        return this.authService.hashPassword(password)
    }
    public getOne(id: number): Promise<UserI> {
        return this.userRepo.findOneOrFail({where :{id}});
      }
    
}
