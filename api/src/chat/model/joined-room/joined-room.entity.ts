import { UserEntity } from "src/user/model/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../room.entity";


@Entity()

export class JoinedRooEntity {


    @PrimaryGeneratedColumn()
    id : number ;


    @Column()
    socketId : string ;


@ManyToOne(() => UserEntity , user => user.joinedRooms)
@JoinColumn()
    user : UserEntity ;


    @ManyToOne(() =>RoomEntity , room => room.joinedUsers)
    @JoinColumn()
    room : RoomEntity ;
}