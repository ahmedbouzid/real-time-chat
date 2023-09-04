import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/model/user.interface';

const bcrypt = require ('bcrypt')
@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService){

     
    }
   async hashPassword(password : string) : Promise<string> {
        return  <string> (bcrypt.hash(password , 12))
    }
    async    comparePAssword(password : string , hashedPass : string) : Promise<any> {
        return  (bcrypt.compare(password , hashedPass))
    }
    async generateJwt(user : UserI) : Promise<string> {
        return (this.jwtService.signAsync({user}))
    }
    verifyJWT(jwt :string) :Promise<any> {
        return this.jwtService.verifyAsync(jwt)
    }
}
