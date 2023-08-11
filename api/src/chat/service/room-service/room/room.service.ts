import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { RoomEntity } from 'src/chat/model/room.entity';
import { RoomI } from 'src/chat/model/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
    constructor(
    @InjectRepository(RoomEntity) 
    private readonly roomRepo :  Repository<RoomEntity>
    ) {}
     
    async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
      const newRoom = await this.addCreatorToRoom(room, creator);
      return this.roomRepo.save(newRoom);
    }
  
    async getRoomsForUser(userId: number, options: IPaginationOptions): Promise<Pagination<RoomI>> {
      const query = this.roomRepo
      .createQueryBuilder('room')
      .leftJoin('room.users', 'user')
      .where('user.id = :userId', {userId})
  
      return paginate(query, options);
    }
  
    async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI> {
      room.users.push(creator);
      return room;
    }
   
  
    async getRoomById(roomId: number): Promise<RoomI | undefined> {
      return this.roomRepo
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.users', 'users')
        .where('room.id = :roomId', { roomId })
        .getOne();
    }
  
    async saveRoom(room: RoomI): Promise<RoomI> {
      return this.roomRepo.save(room);
    }
}
