// chat.service.ts
import { Injectable } from '@angular/core';
import { CustomSocket } from '../sokets/custom-socket';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { UserI } from 'src/app/model/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: CustomSocket , private snackBar : MatSnackBar   ) { }
  sendMessage() {
  }
  getMessage() : Observable<RoomPaginateI> {
    return this.socket.fromEvent('message');
  }

  getMyRooms(): Observable<RoomPaginateI> {
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', {limit, page});
  }
  createRoom(room: RoomI) {
    this.socket.emit('createRoom', room);
    this.snackBar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }

}
