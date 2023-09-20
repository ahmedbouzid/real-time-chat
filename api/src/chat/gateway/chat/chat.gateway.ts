import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthService } from 'src/auth/service/auth/auth.service';
import {Socket, Server} from 'socket.io';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user/user.service';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { RoomService } from 'src/chat/service/room-service/room/room.service';
import { RoomI } from 'src/chat/model/room.interface';
import { PageI } from 'src/chat/model/page.interface';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
import { ConnectUserI } from 'src/chat/model/connected-user.interface';

@WebSocketGateway({ cors: { origin: ['https://hoppscotch.io', 'http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect , OnModuleInit {

  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private authService: AuthService, 
    private userService: UserService , 
    private roomService : RoomService ,
    private connectedUserService : ConnectedUserService
    ) {}

    async onModuleInit() {
      await this.connectedUserService.deleteAll();
    }

    async handleConnection(socket: Socket) {
      try {
        const decodedToken = await this.authService.verifyJWT(socket.handshake.headers.authorization);
        const user: UserI = await this.userService.getOne(decodedToken.user.id);
        if (!user) {
          return this.disconnect(socket);
        } else {
          socket.data.user = user;
          const rooms = await this.roomService.getRoomsForUser(user.id, { page: 1, limit: 10 });
          // substract page -1 to match the angular material paginator
          rooms.meta.currentPage = rooms.meta.currentPage - 1;
          // Save connection to DB
          await this.connectedUserService.create({ socketId: socket.id, user });
          // Only emit rooms to the specific connected client
          return this.server.to(socket.id).emit('rooms', rooms);
        }
      } catch {
        return this.disconnect(socket);
      }
    }

    async handleDisconnect(socket: Socket) {
      // remove connection from DB
      await this.connectedUserService.deleteBySocketId(socket.id);
      socket.disconnect();
    }
    private disconnect(socket: Socket) {
      socket.emit('Error', new UnauthorizedException());
      socket.disconnect();
    }



    @SubscribeMessage('createRoom')
    async onCreateRoom(socket: Socket, room: RoomI) {
      const createdRoom: RoomI = await this.roomService.createRoom(room, socket.data.user);
  
      for (const user of createdRoom.users) {
        const connections: ConnectUserI[] = await this.connectedUserService.findByUser(user);
        const rooms = await this.roomService.getRoomsForUser(user.id, { page: 1, limit: 10 });
        for (const connection of connections) {
          await this.server.to(connection.socketId).emit('rooms', rooms);
        }
      }
    }
 
    @SubscribeMessage('paginateRooms')
    async onPaginateRoom(socket: Socket, page: PageI) {
      page.limit = page.limit > 100 ? 100 : page.limit;
      // add page +1 to match angular material paginator
      page.page = page.page + 1;
      const rooms = await this.roomService.getRoomsForUser(socket.data.user.id, page);
      // substract page -1 to match the angular material paginator
      rooms.meta.currentPage = rooms.meta.currentPage - 1;
      return this.server.to(socket.id).emit('rooms', rooms);
    }
  

}