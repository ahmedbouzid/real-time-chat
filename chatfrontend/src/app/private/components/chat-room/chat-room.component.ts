import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MessagePaginateInterface } from 'src/app/model/message.interface';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements  OnChanges, OnDestroy ,AfterViewInit  {

  @Input() chatRoom: RoomI;
  @ViewChild('messages') private messagesScroller: ElementRef;

  messagesPaginate$: Observable<MessagePaginateInterface> = combineLatest([this.chatService.getMessages(), this.chatService.getAddedMessage().pipe(startWith(null))]).pipe(
    map(([messagePaginate, message]) => {
      if (message && message.room.id === this.chatRoom.id && !messagePaginate.items.some(m => m.id === message.id)) {
        messagePaginate.items.push(message);
      }
      const items = messagePaginate.items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      messagePaginate.items = items;
      return messagePaginate;
          }) ,
          tap(() => this.scrollToBottom())
    )


  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.chatService.leaveRoom(this.chatRoom);
  }

  sendMessage() {
    this.chatService.sendMessage({text: this.chatMessage.value, room: this.chatRoom});
    this.chatMessage.reset();
  }
  scrollToBottom(): void {
    setTimeout(() => {this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight}, 1);
  }


}
