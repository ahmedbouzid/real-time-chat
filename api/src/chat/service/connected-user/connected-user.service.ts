import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/model/connected-user.entity';
import { ConnectUserI } from 'src/chat/model/connected-user.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {

  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>
  ) {}

  async create(connectedUser: ConnectUserI): Promise<ConnectUserI> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: UserI): Promise<ConnectUserI[]> {
    return this.connectedUserRepository.find({where :{user}});
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({socketId});
  }

}