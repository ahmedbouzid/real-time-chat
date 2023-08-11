import { UserI } from "src/user/model/user.interface";


export interface RoomI {

    id ?: number ; 
    name ?: string ; 
    description ?: string ; 
    users ?: UserI[] ; 
    createdAt ?: Date ; 
    updatedAt ?: Date ;
}