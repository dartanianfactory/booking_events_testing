import { UserType } from '../users/UserType';

export type EventType = {
  id?: number;
  user: UserType;
  user_id: string;
  name: string;
  total_seats: number;
};
