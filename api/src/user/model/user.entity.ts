import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
    export class UserEntity {

        @PrimaryGeneratedColumn()
        id : number ;

        @Column()
        username:string ;
        @Column({select:false})
        password : string ;
        @Column({unique:false })
        email : string ;

        @BeforeInsert()
        emailToLowerCase() {
            this.email = this.email.toLowerCase()
        }
        
    }