import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { use } from 'passport';
import { MessageEntity } from 'src/chat/model/message/message.entity';
import { MessageI } from 'src/chat/model/message/messages.interface';
import { RoomI } from 'src/chat/model/room.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepo : Repository <MessageEntity>
    ) {}


    async create( message : MessageI):Promise<MessageI>{
         return this.messageRepo.save(this.messageRepo.create(message)) ;
    }

    async findMessagesForRoom (room : RoomI , options : IPaginationOptions) : Promise<Pagination<MessageI>> {

        const query = this.messageRepo
        .createQueryBuilder('message')
        .leftJoin('message.room', 'room')
        .where('room.id = :roomId', { roomId: room.id })
        .leftJoinAndSelect('message.user', 'user')
        .orderBy('message.created_at', 'DESC');
  
      return paginate(query, options);
    }
}
