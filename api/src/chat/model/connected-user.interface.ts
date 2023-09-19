import { UserI } from "src/user/model/user.interface";

export interface ConnectUserI {
    id ?: number ;
    sockedId ?: string ;
    user : UserI
}