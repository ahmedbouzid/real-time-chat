import { Injectable } from '@angular/core';
import { CustomSocket } from '../sokets/custom-socket';

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
}
