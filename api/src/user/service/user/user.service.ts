import { Get, HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../model/user.entity';
import { UserI } from '../../model/user.interface';
import { Like, Repository } from 'typeorm';
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

   async create (newUser : UserI) :Promise<UserI> {
        try {
            const existes : boolean = await this.mailExiste(newUser.email) ;
            if(!existes) {
                const passwordHash:string = await this.hashPassword(newUser.password);
                newUser.password = passwordHash ;
                const user = await this.userRepo.save(this.userRepo.create(newUser)) ;
                return this.findOne(user.id)
            } else {
                throw new HttpException ('Email is Already in use ' , HttpStatus.CONFLICT)

            }
        } catch  {
            throw new HttpException ('Email is Already in use ' , HttpStatus.CONFLICT)

        }

    }

  
    
        /// change to jwt
       async login(user:UserI) : Promise<string> {

        try {
            const foundUser : UserI = await this.findByEmail(user.email.toLowerCase())
            if (foundUser) {
                const matches : boolean = await this.validatePassword(user.password , foundUser.password) ;

                if(matches) {
                    const payload : UserI = await this.findOne(foundUser.id) ;
                    return this.authService.generateJwt(payload)

                } else {
                    throw new HttpException('Login was not succufully , wrong cridential' , HttpStatus.UNAUTHORIZED)

                }

            } else {
                throw new HttpException('Login was not succufully , wrong cridential' , HttpStatus.UNAUTHORIZED)

            }
            
        } catch (error) {
            throw new HttpException ('User not Found' , HttpStatus.NOT_FOUND)
        }

    
        }

     async mailExiste(email : string) : Promise<boolean> {

        const user = await (this.userRepo.findOne({where :{email}})) ;
        if (user) return  user ? true : false


        
    }

    

    async findOne(id:number ) : Promise <UserI> {
        return (this.userRepo.findOne( {where :{id}}))
    }
    async findAll( options :  IPaginationOptions) : Promise<Pagination<UserI>>{
        return (paginate<UserEntity>(this.userRepo , options))
    }

    async findByEmail (email : string) : Promise<UserI> {

        return  (this.userRepo.findOne({where :{email } , select : ['id' , 'email','username','password']}))
    }
    async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
        try {
            return this.authService.comparePAssword(password ,storedPasswordHash)
        } catch (error) {
            console.error('Password validation error:', error);
            throw new HttpException('Password validation failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async  hashPassword(password : string ): Promise<string>{
        return this.authService.hashPassword(password)
    }
   async  getOne(id: number): Promise<UserI> {
        return this.userRepo.findOneOrFail({where :{id}});
      }
    async findAllByUsername (username : string) : Promise<UserI[]>  {
        return this.userRepo.find( 
         {   where : {
            username : Like(`%${username}%`)
         }
        })
    }
    
}
