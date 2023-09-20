import { UserI } from "src/user/model/user.interface";


export interface ConnectUserI {
  id?: number;
  socketId: string;
  user: UserI;
}