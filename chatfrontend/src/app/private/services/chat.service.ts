// chat.service.ts
import { Injectable } from '@angular/core';
import { CustomSocket } from '../sokets/custom-socket';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { UserI } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: CustomSocket) { }
  sendMessage() {
  }
  getMessage() {
    return this.socket.fromEvent('message');
  }

  getMyRooms() {
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }
  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', {limit, page});
  }
  createRoom() {
    const user2: UserI = {
      id: 5
    };

    const room: RoomI = {
      name: 'Testroom',
      users: [user2]
    }

    this.socket.emit('createRoom', room);
  }

}
