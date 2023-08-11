import { RoomEntity } from "src/chat/model/room.entity";
import { BeforeInsert, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @ManyToMany(() => RoomEntity, room => room.users)
  rooms: RoomEntity[]
 


        @BeforeInsert()
        emailToLowerCase() {
            this.email = this.email.toLowerCase()
        }
        
    }