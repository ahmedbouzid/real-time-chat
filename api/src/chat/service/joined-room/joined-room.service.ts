import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRooEntity } from 'src/chat/model/joined-room/joined-room.entity';
import { JoinedRoomI } from 'src/chat/model/joined-room/joined-room.interface';
import { RoomI } from 'src/chat/model/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService {

    constructor(
@InjectRepository(JoinedRooEntity)
private readonly joinedRoomRepo : Repository<JoinedRooEntity>

    ){}

    async create(joinedUser : JoinedRoomI) : Promise<JoinedRoomI>{
        return this.joinedRoomRepo.save(joinedUser)
    }    


    async findByUser(user : UserI) : Promise<JoinedRoomI[]>{

        return this.joinedRoomRepo.find({where: {user}})
    }


    async findByRoom(room :RoomI) : Promise<JoinedRoomI[]>{

        return this.joinedRoomRepo.find({where :{room}})
    }


    async deleteBySocketId( socketId : string) {

        return this.joinedRoomRepo.delete({socketId})
    }
      
    async deleteAll(){
        await this.joinedRoomRepo
        .createQueryBuilder()
        .delete()
        .execute()

    }
}
