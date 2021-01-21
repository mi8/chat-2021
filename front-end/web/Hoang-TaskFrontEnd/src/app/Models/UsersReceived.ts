import { Task } from '../Models/Tasks';
export interface UserReceived {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  number: number;
  city: string;
  country: string;
  hobby: string;
  role: string;
  tasks: Task[];
  colors: string;
}
