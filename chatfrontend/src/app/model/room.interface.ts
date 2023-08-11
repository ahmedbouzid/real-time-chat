import { Meta } from './meta.interface';
import { UserI } from './user.interface';

export interface RoomI {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomPaginateI {
  items: RoomI[];
  meta: Meta;
}
