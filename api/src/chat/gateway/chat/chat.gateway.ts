import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthService } from 'src/auth/service/auth/auth.service';
import {Socket, Server} from 'socket.io';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { RoomService } from 'src/chat/service/room-service/room/room.service';
import { RoomI } from 'src/chat/model/room.interface';

@WebSocketGateway({ cors: { origin: ['https://hoppscotch.io', 'http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private authService: AuthService, 
    private userService: UserService , 
    private roomService : RoomService
    ) {}

    async handleConnection(socket: Socket) {
      try {
        const decodedToken = await this.authService.verifyJWT(socket.handshake.headers.authorization);
        const user: UserI = await this.userService.getOne(decodedToken.user.id);
        if (!user) {
          return this.disconnect(socket);
        } else {
          this.title.push('Value ' + Math.random().toString());
          this.server.emit('message', this.title);
          socket.data.user = user;
          const rooms = await this.roomService.getRoomsForUser(user.id, {page: 1, limit: 20});
  
          // Only emit rooms to the specific connected client
          return this.server.to(socket.id).emit('rooms', rooms);
        }
      } catch {
        return this.disconnect(socket);
      }
    }

    handleDisconnect(socket: Socket) {
      socket.disconnect();
    }
    private disconnect(socket: Socket) {
      socket.emit('Error', new UnauthorizedException());
      socket.disconnect();
    }



  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI): Promise<RoomI> {
    console.log('====================================');
    console.log(socket.data.user);
    console.log('====================================');
    console.log(room.id);
    console.log('====================================');
    console.log('====================================');
    return await this.roomService.createRoom(room, socket.data.user)
  }


}