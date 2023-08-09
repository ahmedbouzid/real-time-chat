import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from } from 'rxjs';
import { UserI } from 'src/user/model/user.interface';

const bcrypt = require ('bcrypt')
@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService){

     
    }
    hashPassword(password : string) : Observable<string> {
        return from <string> (bcrypt.hash(password , 12))
    }
    comparePAssword(password : string , hashedPass : string) : Observable<any> {
        return from (bcrypt.compare(password , hashedPass))
    }
    generateJwt(user : UserI) : Observable<string> {
        return from (this.jwtService.signAsync({user}))
    }
    verifyJWT(jwt :string) :Promise<any> {
        return this.jwtService.verifyAsync(jwt)
    }
}
