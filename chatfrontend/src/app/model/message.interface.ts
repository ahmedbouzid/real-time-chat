import { Meta } from "./meta.interface";
import { RoomI } from "./room.interface";
import { UserI } from "./user.interface";

export interface MessageI {

  id ?:number ;
  text :string ;
  user ?: UserI ;
  room : RoomI ;
  created_at ?: Date ;
  updated_at ?: Date ;

}

export interface MessagePaginateInterface {
  items : MessageI[] ;
  meta : Meta ;

}
