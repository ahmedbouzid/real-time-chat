import { UserEntity } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JoinedRooEntity } from "./joined-room/joined-room.entity";
import { MessageEntity } from "./message/message.entity";


@Entity()
export class RoomEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => JoinedRooEntity , joinedRoom => joinedRoom.room)
  joinedUsers : JoinedRooEntity[] ;
  
  @OneToMany(() => MessageEntity , messages => messages.room)
  messages : MessageEntity[] ;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
