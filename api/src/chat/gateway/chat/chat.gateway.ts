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
import { JoinedRoomService } from 'src/chat/service/joined-room/joined-room.service';
import { MessageService } from 'src/chat/service/message/message.service';
import { MessageI } from 'src/chat/model/message/messages.interface';
import { JoinedRoomI } from 'src/chat/model/joined-room/joined-room.interface';

@WebSocketGateway({ cors: { origin: ['https://hoppscotch.io', 'http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect , OnModuleInit {

  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private authService: AuthService, 
    private userService: UserService , 
    private roomService : RoomService ,
    private connectedUserService : ConnectedUserService ,
    private joinedRoomService : JoinedRoomService ,
    private messageService : MessageService
    ) {}

    async onModuleInit() {
      await this.connectedUserService.deleteAll();
      await this.joinedRoomService.deleteAll() ;

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
        // *** substract page -1 match the angular material paginator 
        rooms.meta.currentPage = rooms.meta.currentPage - 1 ;
        for (const connection of connections) {
          await this.server.to(connection.socketId).emit('rooms', rooms);
        }
      }
    }
 
    @SubscribeMessage('paginateRooms')
    async onPaginateRoom(socket: Socket, page: PageI) {

      const rooms = await this.roomService.getRoomsForUser(socket.data.user.id,  this.handleIncomingPageRequest(page));
      // substract page -1 to match the angular material paginator
      rooms.meta.currentPage = rooms.meta.currentPage - 1;
      return this.server.to(socket.id).emit('rooms', rooms);
    }

@SubscribeMessage('joinRoom')
async onJoinRoom(socket : Socket , room : RoomI) {
  const messages = await this.messageService.findMessagesForRoom(room , {limit : 10 , page : 1})
  messages.meta.currentPage = messages.meta.currentPage - 1 ;
  //  *** save connexion to room
  await this.joinedRoomService.create({socketId : socket.id , user : socket.data.user , room})
  // *** send last messages from room to User

  await this.server.to(socket.id).emit('messages' , messages)
}
@SubscribeMessage('leaveRoom')
async onLeaveRoom(socket : Socket){
  // *** Remove connection from joinded Rooms
  await this.joinedRoomService.deleteBySocketId(socket.id)
}
@SubscribeMessage('addMessage')
async onAddMessage(socket : Socket , message : MessageI) {
  const createdMessage : MessageI = await this.messageService.create({...message , user : socket.data.user}) ;
  const room : RoomI = await this.roomService.getRoom(createdMessage.room.id) ;
  const joinedUsers : JoinedRoomI[] = await this.joinedRoomService.findByRoom(room) ;
  // *** TO Do Send new Message to all joined user of the room (currentlu online)
}

  private handleIncomingPageRequest(page : PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    return page
  }

}